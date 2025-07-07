const Repo=require('../models/repomodel')
const Commit=require('../models/commit')
const File=require('../models/filemodel')
exports.initrepo=async(req,res)=>{
   
    const {name}=req.body
   
    if(!name) return res.status(400).json({error:"repo name is req"});
    try{
        const newrepo=await Repo.create(
            {

                name
            }
        )
        newrepo.save()
        const url=`http://localhost:3000/repo/${newrepo._id}`
        console.log(url)
        const result={
            name,url
        }

        return res.status(201).json({message:`repo ${name} is initialized `},result)
    }
    catch(error){
        console.log(error)
        
    }
}

