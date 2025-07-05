const fs=require('fs')
const path=require('path')
const crypto=require('crypto')
const zlib=require('zlib')
function hashcontent(content){
    return crypto.createHash('sh1').update(content).digest('hex')
}
function saveBlob(content,gitDir){
    const header=`blob ${content.length}\0`
    const fullcontent=header+content
    const hash=hashcontent(fullcontent)
    const dir=path.join(gitDir,"objects",hash.slice(0,2))
    const filename=path.join(dir,hash.slice(2))

    if(!fs.existsSync(filename)){
        fs.mkdirSync(dir,{recursive:true})
        const compressed=zlib.deflateSync(fullcontent)
        fs.writeFileSync(filename,compressed)
    }
    return hash
}

module.exports=async function add(file) {
    const currentdir=process.cwd()
    const gitpath=path.join(currentdir,".mypit")
    const filepath=path.join(currentdir,file)
    const filesJson=path.join(currentdir,"files.json")
    if(!fs.existsSync(gitpath)){
        console.log("not a git repo ")
        return
    }

    if(!fs.existsSync(filepath)){
        console.log("file does not exists")
       return
    }
    let array=[]

  


    if(fs.existsSync(filesJson)){
     array=JSON.parse(fs.readFileSync(filesJson,'utf-8'))

    }

    if(!array.includes(file)){
        array.push(file)
        console.log(` ${file} staged successfully`)
    }else{
        console.log(`${file} is already staged `)
    }
    fs.writeFileSync(filesJson,JSON.stringify(array,null,2))
    
}