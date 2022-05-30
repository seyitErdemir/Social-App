const express = require('express')
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')

const authMiddleware = require('../middlewares/authMiddleware')
const { body, validationResult } = require('express-validator')

const User = require('../models/User')
 
const router = express.Router()

router.route('/signup').post(
    [
        body('name').not().isEmpty().withMessage("İsim formatı hatalı"),
        body('email').isEmail().withMessage("Email formatı hatalı ")
        .custom((userEmail) =>{
            return User.findOne({ email: userEmail}).then(user => {
                if(user){
                    return Promise.reject("Bu email adresi kullanımda.")
                }
            })
        }) , 
        body('password').not().isEmpty().withMessage("Şifre formatı hatalı.")
    ], authController.createUser) //   http://localhost:3000/users/singup

router.route('/login').post(authController.loginUser) //   http://localhost:3000/users/login
router.route('/logout').get(authController.logoutUser) //  // http://localhost:3000/users/logout

router.route('/preuser').get(userController.preUser) //   http://localhost:3000/users/preuser

router.route('/profileUpdate/:id').put( authMiddleware, userController.updateUser) // http://localhost:3000/users/profileUpdate/:id
router.route('/profilefollow').post(authMiddleware, userController.followUser) // http://localhost:3000/users/profilefollow
router.route('/profileunfollow').post( authMiddleware, userController.unfollowUser) // http://localhost:3000/users/profileunfollow
router.route('/:id').delete(userController.deleteUser) // http://localhost:3000/users/:id

 

module.exports = router
