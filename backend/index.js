const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const app=express()
require('dotenv').config()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})

const database=async()=>{
    await mongoose.connect("mongodb://localhost:27017/pithub")
      .then(()=>{
        console.log("connection established")
        
      })
      .catch((error)=>{
        console.log("the error is ",error)
      })

      
}

database()

app.use(cors())
app.use(express.json({ limit: '100mb' })); // or even '50mb' if needed
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' }));
const gitRoutes=require('./routes/gitroutes')
const UserRoute=require('./routes/UserRoute')
app.use('/repo',gitRoutes)
app.use('/',UserRoute)

