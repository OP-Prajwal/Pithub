const { json } = require('express')
const GitUser=require('../models/GitUser')

const register=async(req,res)=>{

    const {Username,password}=req.body
    if(!Username||!password){
        return res.status(400).json({
            message:"username and password not found"
        })

    }
    

    const pituser=await GitUser.create({
        Username,password
    })

    return res.status(200).json({message:"user registered ", user: pituser})

}

const verify=async(req,res)=>{
     const {Username,password}=req.body
       if(!Username||!password){
       return res.status(400).json({
            message:"username and password not found"
        })

    }

    const user=await GitUser.findOne({Username:Username})
    if(!user) {
      return res.status(400).json({message:"user not found"})
    }

    const ispasswordvalid=await user.comparepassword(password)
    if (!ispasswordvalid) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // Only send one response and return immediately after
    return res.status(200).json({message:"user found and logged in "})

}

const getallrepos=async (req,res)=>{

  
}

module.exports={register,verify}
