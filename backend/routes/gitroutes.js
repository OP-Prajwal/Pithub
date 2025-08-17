const express=require('express')
const router=express.Router()
const {initrepo}=require('../controllers/GitController')
const {authMiddleware}=require('../middleware/usermiddleware')
const {fetchrepo}=require('../controllers/GitController')
const {getallRepos}=require('../controllers/GitController')
const {getRepoStructure}=require('../controllers/GitController')
router.post('/init',authMiddleware,initrepo)

const PushController=require('../controllers/PushController')

// Push objects & commits to a repo
router.post('/push', PushController.push);
router.get('/all',authMiddleware,getallRepos)
router.get('/:repoid',fetchrepo)
router.get('/veiw/:repoid',getRepoStructure)



module.exports=router