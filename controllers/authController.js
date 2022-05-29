const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const Post = require('../models/Post')
const Category = require('../models/Category')
const Course = require('../models/Course')

exports.createUser = async(req, res) => {
    try { 
        const user = await User.create(req.body) 
        await user.following.push({ _id: user._id }) 
        user.save()
        res.status(201).redirect('/login')

    } catch (error) {
        const errors = validationResult(req);
        console.log(errors);
        console.log(errors.array()[0].msg);
        for (let i = 0; i < errors.array().length; i++) {
            req.flash('error',` ${errors.array()[i].msg}  `)
        }


        res.status(400).redirect('/register')
    }
}

exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    req.session.userID = user._id
                     //user session
                    // res.status(200).redirect('/users/dashboard')
                    res.status(200).redirect('/')
                }else{
                      req.flash('error',"Şifreniz doğru değil.")
                      res.status(400).redirect('/login')
                }
            })
        }else{
            req.flash('error',"Kullanıcı mevcut değil.")
            res.status(400).redirect('/login')
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}

exports.preUser = async(req, res) => {
    const user = await User.findById({ _id: req.session.userID }) 
    console.log("buradayım"); 
    user.role = "preuser"
    user.save()
     

    res.status(200).redirect('/')
}


exports.getDashboardPage = async(req, res) => {
    const user = await User.findOne({ _id: req.session.userID }).populate(
        'courses'
    )
    const categories = await Category.find()

    const courses = await Course.find({ user: req.session.userID })

    const users = await User.find()
 

    res.status(200).render('dashboard', {
        page_name: 'dashboard',
        user,
        categories,
        courses,
        users
    })
}


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.find()
        const deleteduser = await User.findById({ _id: req.params.id })
           
        for (let i = 0; i < user.length; i++) {
          
            user[i].following.pull({ _id: req.params.id })
            user[i].save()
        }
        
      
        for (let i = 0; i < deleteduser.followers.length; i++) {
            const xx = await User.findById({ _id: deleteduser.followers[i]._id }) 
            xx.followers.pull({ _id: req.params.id })
            xx.save() 
        } 
      
        
        console.log("buradayım");
    

        await Post.deleteMany({user:req.params.id}) 
        await User.findByIdAndRemove({_id:req.params.id})    

        req.session.destroy(() => {         
            res.status(200).redirect('/')
        })
     

    } catch (error) {
      res.status(201).json({
        status: 'fail',
        error
      })
    }
  }