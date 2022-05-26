const User = require('../models/User')
const Post = require('../models/Post')

exports.getIndexPage = async (req, res) => {
  // console.log(req.session.userID);
  const user = await User.findById({ _id: req.session.userID })

  res.status(200).render('./panel/index', { page_name: 'users/index', user })
}

exports.getUsersPage = async (req, res) => {
  // console.log(req.session.userID);
  const users = await User.find()
  const user = await User.findById({ _id: req.session.userID })
  res
    .status(200)
    .render('./panel/users/index', { page_name: 'index', users, user })
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.find()
    const deleteduser = await User.findById({ _id: req.params.id })

    for (let i = 0; i < user.length; i++) {
      user[i].following.pull({ _id: req.params.id })
    }

    for (let i = 0; i < deleteduser.followers.length; i++) {
      const xx = await User.findById({ _id: deleteduser.followers[i]._id })
      xx.followers.pull({ _id: req.params.id })
    }
    await User.findByIdAndRemove({ _id: req.params.id })
    await Post.deleteMany({ user: req.params.id })
    user.save();


    res.status(200).redirect('/admin/users')
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}
