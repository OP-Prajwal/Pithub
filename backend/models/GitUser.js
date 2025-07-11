const mongoose=require("mongoose")
const bcrpt=require('bcrypt')
const gitUserSchema=new mongoose.Schema({
    Username:{
        type:String,
        unique:true 
    },
    password:{
        type:String
    } 
},{
    timestamps:true,
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})

gitUserSchema.pre('save',async function (next){
    if(!this.isModified("password")){
        return next()
    }
    this.password=await bcrpt.hash(this.password,12)
    next()
})

gitUserSchema.methods.comparepassword=async function (enterpassword){
    return await bcrpt.compare(this.password,enterpassword)
}

module.exports=mongoose.model("GitUser",gitUserSchema)
