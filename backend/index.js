const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

const database=async()=>{
    await mongoose.connect("mongodb://localhost:27017/")
      .then(()=>{
        console.log("connection established")
        
      })
      .catch((error)=>{
        console.log("the error is ",error)
      })

      
}

database()

app.use(cors())
app.use(express.json())
const gitRoutes=require('./routes/gitroutes')
const UserRoute=require('./routes/UserRoute')
app.use('/repo',gitRoutes)
app.use('/',UserRoute)

