const express=require('express')
const router=express.Router()
const {initrepo}=require('../controllers/GitController')

router.post('/init',initrepo)

const PushController=require('../controllers/PushController')

// Push objects & commits to a repo
router.post('/push/:repoId', PushController.push);

module.exports=router