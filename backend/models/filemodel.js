const mongoose=require('mongoose')

const fileschema=new mongoose.Schema({
    repo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"repo"
    },
    filename:{         
        type:String
    },
    content:{
        type:String
    },
    pushedat:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model('file',fileschema)
