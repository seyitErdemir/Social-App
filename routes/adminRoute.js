const express = require('express')
 
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
 

const router = express.Router()

router.route('/').get( [authMiddleware , roleMiddleware([  'admin']) ] , adminController.getIndexPage) //   http://localhost:3000/admin/
router.route('/users').get( [authMiddleware , roleMiddleware([  'admin']) ] ,  adminController.getUsersPage) //   http://localhost:3000/admin/users
router.route('/users/:id').delete( [authMiddleware , roleMiddleware([  'admin']) ] ,  userController.deleteUser) // http://localhost:3000/admin/users/id

//panel için giriş  sayfası   ,   kullanıcıları listeleme ve silme  bölümleri oluşturuldu

 
module.exports = router
