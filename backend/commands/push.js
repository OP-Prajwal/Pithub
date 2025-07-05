const fs=require('fs')
const path=require('path')

const axios=require('axios')

module.exports=async function push(){
       const currentdir=process.cwd()
        const gitpath=path.join(currentdir,".mypit")
        const configpath=path.join(gitpath,"config.json")
        const filesJson=path.join(currentdir,"files.json")

        if(!fs.existsSync(gitpath)){
            console.log("not a git repo ")
            return
        }
    
        if(!fs.existsSync(configpath)){
            console.log("config file does not exists")
           return
        }

         if(!fs.existsSync(filesJson)){
            console.log("no files staged ")
           return
        }

        const files=[]
        const configdata=JSON.parse(fs.readFileSync(configpath,"utf-8"))
        const repoid=configdata.remote
    
        const stagedfiles=JSON.parse(fs.readFileSync(filesJson,"utf-8"))

        for (const file of stagedfiles){

            const filepath=path.join(currentdir,file)
            if(fs.existsSync(filepath)){
                const content=fs.readFileSync(filepath,"utf-8")
                files.push({file,content})

            }else{
                console.log(`${file} does not exist`)
            }
        }
       

    
        const res=await axios.post(`${repoid}/push`,{
            message:"first push of all files ",files
        })

        console.log(res.data)
        if(res){
            
            console.log("files are pushed succesfully ")
            fs.writeFileSync(filesJson,JSON.stringify([],null,2))
        }else{
            console.log("some error in pushing to mongo")
        }
    
   


}