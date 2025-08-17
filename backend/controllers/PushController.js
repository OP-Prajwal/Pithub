const Blob = require('../models/blobmodel');
const Commit = require('../models/commit');
const Repo = require('../models/repomodel');

exports.push = async (req, res) => {
  const { commitHash, objects, message, timestamp, parent,repoId } = req.body;
  

  console.log('⬇️  Incoming /push body →', JSON.stringify(req.body, null, 2));

  if (!repoId || !commitHash || !objects || !Array.isArray(objects)) {
    return res.status(400).json({ error: 'Missing required fields: repoId, commitHash, or objects' });
  }

  try {
    // 1. Save all Git objects (blobs, trees, etc.)
    for (const obj of objects) {
      if (!obj.hash || !obj.type || !obj.content) {
        console.warn('⚠️ Skipping invalid object:', obj);
        continue;
      }

      const exists = await Blob.findOne({ hash: obj.hash });
      if (!exists) {
        await Blob.create({
          hash: obj.hash,
          type: obj.type,
          content: obj.content
        });
      }
    }

    // 2. Find the tree object (required)
    const treeObj = objects.find(o => o.type === 'tree');
    if (!treeObj) {
      return res.status(400).json({ error: 'No tree object provided' });
    }

    // 3. Create commit
    const commitDoc = await Commit.create({
      hash: commitHash,
      tree: treeObj.hash,
      message: message || 'No message',
      timestamp: timestamp || new Date().toISOString(),
      parent: parent || null
    });

    // 4. Link commit to repo
    const updatedRepo = await Repo.findByIdAndUpdate(
      repoId,
      { $push: { commits: commitDoc._id } },
      { new: true }
    );

    if (!updatedRepo) {
      return res.status(404).json({ error: 'Repo not found' });
    }

    res.status(201).json({
      message: '✅ Pushed to remote repo successfully',
      commitId: commitDoc._id,
      repoId: updatedRepo._id
    });
  } catch (err) {
    console.error('❌ Push error:', err);
    res.status(500).json({ error: '❌ Failed to push to repo', details: err.message });
  }
};
