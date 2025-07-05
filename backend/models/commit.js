const mongoose=require('mongoose')

const commitschema=new mongoose.Schema({
    repo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"repo"
    },
    message:{
        type:String
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    files:[{
        filename:String,
        content:String
    }]

})

module.exports=mongoose.model('commit',commitschema)