const express=require('express')
const { register, verify } = require('../controllers/Usercontroller')

const router=express.Router()

router.post('/signup',register)

router.post('/login',verify)

module.exports=router
