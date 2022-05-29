const express = require('express')
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const { body, validationResult } = require('express-validator')

const User = require('../models/User')

const router = express.Router()

router.route('/singup').post(
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
router.route('/preuser').get(authController.preUser) //   http://localhost:3000/users/preuser

router.route('/logout').get(authController.logoutUser) //
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage) //  http://localhost:3000/users/dashboard
router.route('/:id').delete(authController.deleteUser) // http://

module.exports = router
