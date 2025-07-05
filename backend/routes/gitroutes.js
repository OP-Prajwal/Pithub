const express=require('express')
const router=express.Router()
const {initrepo}=require('../controllers/GitController')
const {pushfiles}=require('../controllers/GitController')
router.post('/init',initrepo)

router.post('/:repoid/push',pushfiles)

module.exports=router