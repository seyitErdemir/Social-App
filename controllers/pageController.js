const nodemailer = require('nodemailer')
 
const User = require('../models/User')
const Post = require('../models/Post')

exports.getIndexPage = async (req, res) => {
  // const post = await Post.find({ user: req.session.userID })  .sort('-createdAt') .populate('user')

  const user = await User.findById({ _id: req.session.userID })
  const post = await Post.find({ user: user.following })
    .sort('-createdAt')
    .populate('user')

  for (let i = 0; i < post.length; i++) {
    post[i].like.map(lk => {
      if (lk == req.session.userID) {
        post[i].userId = true
      }
    })
  }

  const users = await User.find().limit(6).sort('-createdAt')
  unfollowUser = await User.findById(req.body.user_id)
      
    users.map((usr, i) => {
      if (usr._id == req.session.userID) {
        users.splice(i ,1)
      }
    })

  const totalFollowing = user.following.length
  const totalFollowers = user.followers.length
  res.status(200).render('index', {
    page_name: 'index',
    user,
    totalFollowing,
    totalFollowers,
    post,
    users
  })
}

exports.getSearchPage = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.session.userID })

    const query = req.body.search
    let filter = {}
    if (query) {
      filter = { name: query }
    } else {
      filter.name = ''
    }
    const users = await User.find({
      $or: [{ name: { $regex: '.*' + filter.name + '.*', $options: 'i' } }]
    }).sort('-createdAt')
    res.status(200).render('searchList', { page_name:"search",   users, query , user })
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

exports.getUserProfilePage = async (req, res) => {
  try {
    var active = ' '
    const post = await Post.find({ user: req.params.id })
      .sort('-createdAt')
      .populate('user')

    for (let i = 0; i < post.length; i++) {
      post[i].like.map(lk => {
        if (lk == req.session.userID) {
          post[i].userId = true
        }
      })
    }

    const users = await User.find()
      .sort('-createdAt')
      .limit(7)
      users.map((usr, i) => {
        if (usr._id == req.session.userID) {
          users.splice(i ,1)
        }
      })

    const user = await User.findById({ _id: req.session.userID })
    const userProfile = await User.findById({ _id: req.params.id })
    const totalFollowing = userProfile.following.length
    const totalFollowers = userProfile.followers.length

    if (req.session.userID === req.params.id) {
      active = true
    } else {
      active = false
    }

    //search  ve   profile detay kısımları yapıldı

    res.status(200).render('profile', {
      page_name: 'profile',
      userProfile,
      user,
      users,
      active,
      totalFollowing,
      totalFollowers,
      post
    })
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

 
exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', { page_name: 'register' })
}

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', { page_name: 'login' })
}

 

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = ` 
        <h1>Message Details</h1>
        <ul>
            <li> name : ${req.body.name} </li>
            <li> email :  ${req.body.email}  </li>
            <li> message : ${req.body.message}   </li>
        
        </ul>
    `

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'seyiterdemir4242@gmail.com', // gmail account
        pass: 'qzylnxurwlullnci' // gmail password
      }
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart Edu Contact Form" <seyiterdemir4242>', // sender address
      to: 'seyiterdemir4242@gmail.com,', // list of receivers
      subject: 'Smart Edu Contact Form New Message ', // Subject line
      html: outputMessage // html body
    })

    console.log('Message sent: %s', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    req.flash('success', 'We recoived your message successfully')
    res.status(200).redirect('/contact')
  } catch (error) {
    // req.flash('error',` Something Happened  ${error}` )
    req.flash('error', 'Something Happened')
    res.status(200).redirect('/contact')
  }
}
