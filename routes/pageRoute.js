const express = require('express')
const pageController = require('../controllers/pageController')
const redirectMiddleware = require('../middlewares/redirectMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.route('/').get( authMiddleware, pageController.getIndexPage)
router.route('/search').post(authMiddleware, pageController.getSearchPage)
router.route('/profile/:id').get( authMiddleware, pageController.getUserProfilePage)
router.route('/register').get(redirectMiddleware, pageController.getRegisterPage)
router.route('/login').get(redirectMiddleware, pageController.getLoginPage)



module.exports = router