const User = require('../models/User') 

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

 
