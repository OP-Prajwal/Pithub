
const GitUser=require('../models/GitUser')
const jwt=require('jsonwebtoken')
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
     const token = jwt.sign({id:pituser._id, Username: pituser.Username }, process.env.secretkey,
       { expiresIn: '7d' }
     )

    return res.status(200).json({message:"user registered ", user: pituser,token})

}

const verify = async (req, res) => {
    const { Username, password } = req.body;
    if (!Username || !password) {
        return res.status(400).json({
            message: "username and password not found"
        });
    }

    const user = await GitUser.findOne({ Username: Username });
    if (!user) {
        return res.status(400).json({ message: "user not found" });
    }

    const ispasswordvalid = await user.comparepassword(password);
    
    if (!ispasswordvalid) {
        return res.status(400).json({
            message: "Invalid password"
        });
    }

    // Generate JWT token
  const token = jwt.sign({id:user._id, Username: user.Username }, process.env.secretkey, { expiresIn: '7d' })

    

    return res.status(200).json({
        message: "user found and logged in",
        _id: user._id,
        token
    });
};

const getallrepos=async (req,res)=>{

  
}

module.exports={register,verify}
