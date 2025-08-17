const Repo=require('../models/repomodel')

const Blob=require('../models/blobmodel')
const GitUser=require('../models/GitUser')
exports.initrepo = async (req, res) => {
  const { name, description, isprivate } = req.body;
  const { Username } = req.user;

  if (!name) return res.status(400).json({ error: "Repo name is required." });

  try {
    // 1. Create the new repo
    const newrepo = await Repo.create({ name, description, isprivate });

    // 2. Update the user's repo array
    await GitUser.findOneAndUpdate(
      { Username },
      { $push: { repos: newrepo._id } },
      { new: true } // optional: to return updated user
    );

    // 3. Generate URL and return response
    const url = `http://localhost:3000/repo/${Username}/${newrepo._id}`;
    console.log(url);

    return res.status(201).json({
      message: `Repo '${name}' initialized.`,
      repo: {
        name: newrepo.name,
        url,
        id: newrepo._id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to initialize repo',
      details: error.message
    });
  }
};


exports.fetchrepo=async (req,res)=>{
    try{
        const repoId=req.params.repoid
        const repo=await Repo.findById(repoId)
    
        if(repo) return res.status(201).json({message:"repo fetched",repo}) 

    }catch(err){
        return res.status(500).json({error:"failed ",err})
    }
}

exports.getallRepos = async (req, res) => {
    try {
        const { id } = req.user;

        const user = await GitUser.findById(id).populate('repos');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const repos = user.repos;
       

        return res.status(200).json({ message: "All repos fetched", repos });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.getRepoStructure = async (req, res) => {
  try {
    const repo = await Repo.findById(req.params.repoid).populate('commits');
    console.log(repo)

    if (!repo || !repo.commits.length) {
      return res.status(404).json({ error: 'Repo or commits not found' });
    }

    // Latest commit = last in array
    const latestCommit = repo.commits[repo.commits.length - 1];
    const allObjects = {};

    async function collectObjects(hash) {
      if (allObjects[hash]) return;

      const obj = await Blob.findOne({ hash });
      if (!obj) return;

      allObjects[hash] = {
        type: obj.type,
        content: obj.content
      };

      if (obj.type === 'tree') {
        const lines = obj.content.trim().split('\n');
        for (const line of lines) {
          const [, childHash] = line.split(' ');
          await collectObjects(childHash);
        }
      }

      if (obj.type === 'commit') {
        const treeHash = obj.content.split('\n').find(l => l.startsWith('tree '))?.split(' ')[1];
        if (treeHash) await collectObjects(treeHash);
      }
    }

    // Start from latest commit hash
    await collectObjects(latestCommit.hash);
console.log("last")
    console.log(latestCommit.tree)
    return res.status(200).json({
      treeHash: latestCommit.tree,
      files: allObjects
    });
  } catch (err) {
    console.error('❌ Repo structure error:', err);
    return res.status(500).json({ error: 'Failed to get repo structure', details: err.message });
  }
};




