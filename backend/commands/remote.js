const fs=require('fs')
const path=require('path')

module.exports=async function addremote(url){


    const currdir=process.cwd()
    const gitpath=path.join(currdir,'.mypit')
    const configpath=path.join(gitpath,"config.json")
    console.log(configpath)
    if(!fs.existsSync(configpath)){
        console.log("config file not found")
        return
    }
    const config=JSON.parse(fs.readFileSync(configpath,'utf-8'))
    config.remote=url

    fs.writeFileSync(configpath,JSON.stringify(config,null,2))

    console.log("remote url added to this repo ")
}  
