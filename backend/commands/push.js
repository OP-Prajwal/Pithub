const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const axios = require('axios');

module.exports = async function push() {
  const gitDir = path.join(process.cwd(), '.mygit');
  const config = JSON.parse(fs.readFileSync(path.join(gitDir, 'config.json'), 'utf-8'));
  const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf-8').trim();

  if (!config.remote) {
    console.log('❌ No remote set. Run `mygit remote <repoId>` first.');
    return;
  }

  const objects = [];
  const walkObjects = (hash, seen = new Set()) => {
    if (seen.has(hash)) return;
    seen.add(hash);

    const dir = path.join(gitDir, 'objects', hash.slice(0, 2));
    const file = path.join(dir, hash.slice(2));
    if (!fs.existsSync(file)) return;

    const buffer = zlib.inflateSync(fs.readFileSync(file));
    const headerEnd = buffer.indexOf(0);
    const header = buffer.slice(0, headerEnd).toString();
    const type = header.split(' ')[0];
    const content = buffer.slice(headerEnd + 1).toString();

    objects.push({ hash, type, content });

    // Recursively fetch blobs inside tree
    if (type === 'tree') {
      const lines = content.trim().split('\n');
      for (const line of lines) {
        const [, childHash] = line.split(' ');
        walkObjects(childHash, seen);
      }
    }

    if (type === 'commit') {
      const lines = content.split('\n');
      const treeLine = lines.find(l => l.startsWith('tree '));
      const parentLine = lines.find(l => l.startsWith('parent '));
      if (treeLine) walkObjects(treeLine.split(' ')[1], seen);
      if (parentLine) walkObjects(parentLine.split(' ')[1], seen);
    }
  };

  walkObjects(head);

  // Send all objects and metadata to backend
  try {
    await axios.post(`http://localhost:3000/git/push/${config.remote}`, {
      commitHash: head,
      objects,
      message: objects.find(o => o.type === 'commit')?.content.split('message ')[1].trim(),
      timestamp: new Date().toISOString(),
      parent: null // optional
    });

    console.log('🚀 Pushed to remote successfully!');
  } catch (err) {
    console.error('❌ Push failed:', err.message);
  }
};
