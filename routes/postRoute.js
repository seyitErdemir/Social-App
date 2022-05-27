const express = require('express')
const postController = require('../controllers/postController') 
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()


router.route('/create').post( authMiddleware ,  postController.createPost) //   http://localhost:3000/post/create

router.route('/like').post(authMiddleware, postController.likePost)  //   http://localhost:3000/post/like
router.route('/unlike').post( authMiddleware, postController.unlikePost)   //   http://localhost:3000/post/unlike



router.route('/:id').delete(postController.deletePost)
router.route('/:id').put(postController.updatePost)

router.route('/').get(postController.getAllPosts)
router.route('/:slug').get(postController.getPost)
router.route('/:slug').put(postController.updatePost)

router.route('/enroll').post(postController.enrollPost)
router.route('/release').post(postController.releasePost)

module.exports = router