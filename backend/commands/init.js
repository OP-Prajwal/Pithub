const fs=require('fs-extra')

const path=require('path')
const axios=require('axios')
module.exports=async function init(){
    
    
    const repopath=path.join(process.cwd())    
    fs.mkdirpSync(path.join(repopath,".mypit"))
    fs.writeFileSync(path.join(repopath,".mypit","config.json"),JSON.stringify({
    name:null,created:new Date().toISOString(),remote:null
},null,2))
   

console.log(`Repository initialized `)


}