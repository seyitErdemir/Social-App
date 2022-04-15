const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')

exports.createPost = async (req, res) => {
  try {

    console.log("buradayım");
    const post = await Post.create({ 
      description: req.body.description 
     
    })

    
    req.flash('success',` ${req.body.name} has been created successfully`)
    res.status(201).redirect('/')
  } catch (error) {
    req.flash('error',"Something Happened")
    res.status(400).redirect('/posts')
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    const categorySlug = req.query.categories
    const category = await Category.findOne({ slug: categorySlug })
    const query = req.query.search

    let filter = {};

    if(categorySlug) {
      filter = {category:category._id}
    }

    if(query) {
      filter = {name:query}
    }

    if(!query && !categorySlug) {
      filter.name = "",
      filter.category = null
    }

     

    const posts = await Post.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category }
      ]
    }).sort('-createdAt').populate('user')

 
    const categories = await Category.find()
 
    

    res.status(200).render('posts', {
      posts,
      categories,
      page_name: 'posts'
    })
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

exports.getPost = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID)
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      'user'
    )

    const categories = await Category.find()

    res.status(200).render('post', {
      post,
      page_name: 'posts',
      user,
      categories
    })
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

exports.enrollPost = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID)
    await user.posts.push({ _id: req.body.post_id })
    await user.save()

    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

exports.releasePost = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID)
    await user.posts.pull({ _id: req.body.post_id })
    await user.save()

    res.status(200).redirect('/users/dashboard')
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

exports.deletePost = async (req, res) => {
  try {
   const post=  await Post.findOneAndRemove({slug:req.params.slug})
    req.flash('error',` ${post.name} has been removed successfully`)

    res.status(200).redirect('/users/dashboard')

  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}


exports.updatePost = async (req, res) => {
  try {
   const post=  await Post.findOne({slug:req.params.slug})
    post.name = req.body.name
    post.description = req.body.description
    post.category = req.body.category

    post.save()
 
    res.status(200).redirect('/users/dashboard')

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error
    })
  }
}

