const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const axios = require('axios');

module.exports = async function push() {
  const gitDir = path.join(process.cwd(), '.mypit');
  const configPath = path.join(gitDir, 'config.json');
  const headPath = path.join(gitDir, 'HEAD');

  if (!fs.existsSync(configPath) || !fs.existsSync(headPath)) {
    console.log('❌ Git repo not properly initialized.');
    return;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const head = fs.readFileSync(headPath, 'utf-8').trim();

  if (!config.remote) {
    console.log('❌ No remote set. Run `mypit remote <repoId>` first.');
    return;
  }

  const repoId = config.remote.includes('/')
    ? config.remote.split('/').pop()
    : config.remote;

  const seen = new Set();
  const objects = [];

  function walkObjects(hash) {
    if (seen.has(hash)) return;
    seen.add(hash);

    const objectDir = path.join(gitDir, 'objects', hash.slice(0, 2));
    const objectFile = path.join(objectDir, hash.slice(2));

    if (!fs.existsSync(objectFile)) return;

    const compressed = fs.readFileSync(objectFile);
    const buffer = zlib.inflateSync(compressed);

    const headerEnd = buffer.indexOf(0);
    const header = buffer.slice(0, headerEnd).toString();
    const type = header.split(' ')[0];
    const content = buffer.slice(headerEnd + 1).toString();

    objects.push({ hash, type, content });

    if (type === 'tree') {
      const lines = content.trim().split('\n');
      for (const line of lines) {
        const [, childHash] = line.split(' ');
        if (childHash) walkObjects(childHash);
      }
    }

    if (type === 'commit') {
      const lines = content.split('\n');
      const treeLine = lines.find(l => l.startsWith('tree '));
      const parentLine = lines.find(l => l.startsWith('parent '));
      if (treeLine) walkObjects(treeLine.split(' ')[1]);
      if (parentLine) walkObjects(parentLine.split(' ')[1]);
    }
  }

  walkObjects(head);

  const commitObj = objects.find(obj => obj.hash === head && obj.type === 'commit');
  if (!commitObj) {
    console.log('❌ Could not find commit object.');
    return;
  }

  const commitLines = commitObj.content.split('\n');
  const message = commitLines.find(line => line.startsWith('message '))?.slice(8).trim() || 'No message';
  const timestamp = commitLines.find(line => line.startsWith('date '))?.slice(5).trim() || new Date().toISOString();
  const parent = commitLines.find(line => line.startsWith('parent '))?.slice(7).trim() || null;

  try {
    console.log('\n🧪 DEBUG: Push Payload Preview:');
console.log('repoId:', repoId);
console.log('commitHash:', head);
console.log('objects.length:', objects.length);
console.log('message:', message);
console.log('timestamp:', timestamp);
console.log('parent:', parent);

    const res = await axios.post(`http://localhost:3000/repo/push`, {
      repoId,
      commitHash: head,
      message,
      timestamp,
      parent,
      objects
    });

    console.log('🚀 Push successful:', res.data.message || 'Done!');
  } catch (err) {
    console.error('❌ Push failed:', err.response?.data || err.message);
  }
};
