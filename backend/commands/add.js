const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

// SHA-1 hashing
function hashContent(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

// Save blob to .mygit/objects/
function saveBlob(content, gitDir) {
  const header = `blob ${content.length}\0`;
  const fullContent = header + content;
  const hash = hashContent(fullContent);

  const dir = path.join(gitDir, 'objects', hash.slice(0, 2));
  const filePath = path.join(dir, hash.slice(2));

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(dir, { recursive: true });
    const compressed = zlib.deflateSync(fullContent);
    fs.writeFileSync(filePath, compressed);
  }

  return hash;
}

// Recursive file walker
function walkFiles(baseDir, filePath) {
  const fullPath = path.join(baseDir, filePath);
  let files = [];

  const stat = fs.statSync(fullPath);
  if (stat.isFile()) {
    files.push(filePath);
  } else if (stat.isDirectory()) {
    const items = fs.readdirSync(fullPath);
    for (const item of items) {
      const relative = path.join(filePath, item);
      files = files.concat(walkFiles(baseDir, relative));
    }
  }

  return files;
}

// ADD command
module.exports = function add(inputPath) {
  const currentDir = process.cwd();
  const gitDir = path.join(currentDir, '.mygit');

  if (!fs.existsSync(gitDir)) {
    console.log('❌ No repo found. Run `mygit init` first.');
    return;
  }

  const indexPath = path.join(gitDir, 'index.json');
  let index = {};
  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  }

  const allFiles = walkFiles(currentDir, inputPath);

  for (const file of allFiles) {
    if (file.startsWith('.mygit')) continue; // Don't add internal files

    const content = fs.readFileSync(file, 'utf-8');
    const hash = saveBlob(content, gitDir);

    index[file] = {
      hash,
      path: file,
      stagedAt: new Date().toISOString()
    };

    console.log(`✅ Staged ${file} [${hash.slice(0, 7)}...]`);
  }

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
};
