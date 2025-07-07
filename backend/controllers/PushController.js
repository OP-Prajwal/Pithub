const Blob = require('../models/blobmodel');
const Commit = require('../models/commit');
const Repo = require('../models/repomodel');

exports.push = async (req, res) => {
  const { commitHash, objects, message, timestamp, parent } = req.body;
  const { repoId } = req.params;

  try {
    // 1. Save all Git objects (blobs, trees, commits)
    for (const obj of objects) {
      const exists = await Blob.findOne({ hash: obj.hash });
      if (!exists) {
        await Blob.create({
          hash: obj.hash,
          type: obj.type,
          content: obj.content
        });
      }
    }

    // 2. Create the commit
    const treeObj = objects.find(o => o.type === 'tree');
    const commit = await Commit.create({
      hash: commitHash,
      tree: treeObj?.hash || '',
      message,
      timestamp,
      parent: parent || null
    });

    // 3. Link commit to repo
    await Repo.findByIdAndUpdate(repoId, {
      $push: { commits: commit._id }
    });

    res.status(201).json({ message: '✅ Pushed to remote repo successfully' });
  } catch (err) {
    console.error('❌ Push error:', err);
    res.status(500).json({ error: '❌ Failed to push to repo', details: err.message });
  }
};
