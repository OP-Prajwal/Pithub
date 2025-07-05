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

exports.pushfiles=async(req,res)=>{
    const repoid=req.params.repoid
    const {message,files}=req.body
    if( !files || !Array.isArray(files)){
        return res.status(400).json({message:"data not found"})
    }

    try{
        const repo=await Repo.findById(repoid)
        if(!repo){
            return res.status(404).json({message:"repo not found"})
        }

        for (const f of files){

            const {file,content}=f
            const savedfile=await File.create({
                repo:repo._id,filename:file,content:content
            })
        
            if(savedfile){


                console.log(`${file} pushed `)
            }else{
                console.log(`${file} did not get pushed`)
            }
        }



        
        return res.status(500).json({message:"commit pushed "})
    }
    catch(error){
        console.log("error occoured ",error)
        return res.status(500).json({message:"internal server error "})
    }
}