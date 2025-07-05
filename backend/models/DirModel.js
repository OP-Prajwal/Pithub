const mongoose=require('mongoose')

const dirSchema=new mongoose.Schema({
    DirName:{
        type:String 
    },
    files:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"file"
        }

    ]
},{
    timestamps:true
})

module.exports=mongoose.model('DirModel',dirSchema)