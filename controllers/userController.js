const fs = require('fs')
const path = require('path')

const User = require('../models/User')
const Post = require('../models/Post')

exports.updateUser = async (req, res) => {
    try {
      // console.log(req.files.image)
      const uploadDir = 'public/images/users'
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir)
      }
  
      var userImage = ''
      if (!(!req.files || Object.keys(req.files).length === 0)) {
        let uploadImage = req.files.image
        const type = uploadImage.mimetype.slice(
          uploadImage.mimetype.search('/') + 1
        )
        const imageName = Math.floor(Math.random() * 1000000000000000000)
  
        // let uploadPath = __dirname + "/public/uploads/" + uploadImage.name
        let uploadPath =
          path.resolve(__dirname, '..') +
          '/public/images/users/' +
          imageName +
          '.' +
          type
        uploadImage.mv(uploadPath)
        userImage = '/images/users/' + imageName + '.' + type
      } else {
        userImage = req.body.old_img
      }
  
      console.log('image adresi :', userImage)
       
      const user = await User.findById({ _id: req.params.id })
      
      var password = ""
      if(req.body.password){
        password = req.body.password
      }else{
           password = user.password     
      }
      user.email = req.body.email
      user.password = password
      user.name = req.body.name
      user.title = req.body.title
      user.about = req.body.about
      user.skills = req.body.skills
      user.companyName = req.body.companyName
      user.position = req.body.position
      user.oTime = req.body.oTime
      user.image = userImage
      user.save()
  
      req.flash('success', 'has been created successfully')
      res.status(200).redirect('back')
    } catch (error) {
      req.flash('error', 'has been created successfully')
      res.status(200).redirect('back')
  
      // res.status(400).json({
      //   status: 'fail',
      //   error
      // })
    }
  }
  
  exports.followUser = async (req, res) => {
    try {
        console.log("buradayım");
      //giriş yapan kullanıcı bir kullanıcıyı takip ettiği zaman  ?
  
      //alttaki satırda giriş yapan kullnıcının following dizisine takip etmek istediği profilin idsini eklemekte
      const user = await User.findById(req.session.userID)
      await user.following.push({ _id: req.body.user_id })
  
      //alttaki satırda ise takip ettigi kullanıcının followers  dizisine  takip eden profilin idsini eklemekte
      const followUser = await User.findById(req.body.user_id)
      await followUser.followers.push({ _id: req.session.userID })
  
      await user.save()
      await followUser.save()
  
      res.status(200).redirect('back')
    } catch (error) {
      res.status(201).json({
        status: 'fail',
        error
      })
    }
  }
  
  exports.unfollowUser = async (req, res) => {
    try {
      const user = await User.findById(req.session.userID)
      await user.following.pull({ _id: req.body.user_id })
  
      const unfollowUser = await User.findById(req.body.user_id)
      await unfollowUser.followers.pull({ _id: req.session.userID })
  
      await user.save()
      await unfollowUser.save()
  
      res.status(200).redirect('back')
    } catch (error) {
      res.status(201).json({
        status: 'fail',
        error
      })
    }
  }

  exports.preUser = async(req, res) => {
    const user = await User.findById({ _id: req.session.userID }) 
    console.log("buradayım"); 
    user.role = "preuser"
    user.save()
     

    res.status(200).redirect('/')
}


exports.deleteUser = async (req, res) => {
  try {
      const user = await User.find()
      const deleteduser = await User.findById({ _id: req.params.id })      
      for (let i = 0; i < user.length; i++) {
          user[i].following.pull({ _id: req.params.id })
          user[i].save()
          // her kullanıcın takip ettiklerindem silinen kullanıcıyı çıkarıyorum.
      }
     
        for (let j = 0; j < deleteduser.following.length; j++) {
          const xx = await User.findById({ _id: deleteduser.following[j]})
          xx.followers.pull( req.params.id )
          xx.save()     
         }    
        await Post.deleteMany({user:req.params.id}) 
        console.log( deleteduser.following.length );
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