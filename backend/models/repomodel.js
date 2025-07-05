const mongoose=require('mongoose')

const reposchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('repo',reposchema)
