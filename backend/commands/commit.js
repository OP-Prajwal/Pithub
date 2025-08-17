const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

// Helper: create SHA-1 hash
function sha1(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

// Save an object (blob/tree/commit) to .mygit/objects/
function saveObject(type, content, gitDir) {
  const header = `${type} ${content.length}\0`;
  const full = header + content;
  const hash = sha1(full);
  const dir = path.join(gitDir, 'objects', hash.slice(0, 2));
  const file = path.join(dir, hash.slice(2));

  if (!fs.existsSync(file)) {
    fs.mkdirSync(dir, { recursive: true });
    const compressed = zlib.deflateSync(full);
    fs.writeFileSync(file, compressed);
  }

  return hash;
}

module.exports = function commit(message) {
  const repoDir = process.cwd();
  const gitDir = path.join(repoDir, '.mypit');
 const indexPath = path.join(gitDir, 'index.json'); // remove 'objects'

  const headPath = path.join(gitDir, 'HEAD');

  if (!fs.existsSync(indexPath)) {
    console.log('❌ Nothing staged for commit.');
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // 1. Build tree content
  let treeContent = '';
  for (const [filename, entry] of Object.entries(index)) {
    // Format: blob <hash> <filename>
    treeContent += `blob ${entry.hash} ${filename}\n`;
  }

  // 2. Save tree object
  const treeHash = saveObject('tree', treeContent, gitDir);

  // 3. Prepare commit content
  const timestamp = new Date().toISOString();
  let commitContent = `tree ${treeHash}\n`;
  if (fs.existsSync(headPath)) {
    const parent = fs.readFileSync(headPath, 'utf-8').trim();
    if (parent) commitContent += `parent ${parent}\n`;
  }
  commitContent += `date ${timestamp}\n`;
  commitContent += `message ${message}\n`;

  // 4. Save commit object
  const commitHash = saveObject('commit', commitContent, gitDir);

  // 5. Update HEAD
  fs.writeFileSync(headPath, commitHash);

  // 6. Clear the index
  fs.writeFileSync(indexPath, '{}');

  console.log(`✅ Committed as ${commitHash.slice(0, 7)} - "${message}"`);
};
