const express = require('express')
const router = express.Router()
const auth = require('../auth')
const Top5ListController = require('../controllers/top5list-controller')

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.delete('/communitytop5list/:id', auth.verify, Top5ListController.deleteCommunityTop5List)
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs)
router.get('/publishedtop5listpairs', auth.verify, Top5ListController.getPublishedTop5ListPairs)
router.get('/communitytop5listpairs', auth.verify, Top5ListController.getCommunityTop5ListPairs)
router.get('/top5lists', auth.verify, Top5ListController.getTop5Lists)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)
router.put('/top5list1/:id', auth.verify, Top5ListController.updateTop5ListNoPerms)

module.exports = router