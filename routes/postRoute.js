const express = require('express')
const postController = require('../controllers/postController') 
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()


router.route('/create').post( authMiddleware ,  postController.createPost) //   http://localhost:3000/post
router.route('/').get(postController.getAllPosts)
router.route('/:slug').get(postController.getPost)
router.route('/:slug').delete(postController.deletePost)
router.route('/:slug').put(postController.updatePost)

router.route('/enroll').post(postController.enrollPost)
router.route('/release').post(postController.releasePost)

module.exports = router