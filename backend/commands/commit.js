const fs=require("fs")
const path=require('path')

module.exports=async function commit(message) {
       const currentdir=process.cwd()
       const gitpath=path.join(currentdir,".mypit")
       
       const filesJson=path.join(currentdir,"files.json")
       const commits=path.join(currentdir,"commits")
       if(!fs.existsSync(gitpath)){
           console.log("not a git repo ")
           return
       }

       const stagedfiles=JSON.parse(fs.readFileSync(filesJson))

       if(stagedfiles.length===0){

        console.log("ntg to commit ")
        return
       }

       const commit={

        message,
        timestamp:new Date().toISOString(),
        files:[]
       }


      

   
}