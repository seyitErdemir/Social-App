const fs = require("fs");
const path = require("path");


const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User');
const { exit } = require("process");

exports.createPost = async (req, res) => {
  try {
    const uploadDir = 'public/images/posts'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
 
    if (req.files) {
      let uploadImage = req.files.image
      const type = uploadImage.mimetype.slice(uploadImage.mimetype.search("/") + 1)
      const imageName = Math.floor(Math.random() * 1000000000000000000)
      let uploadPath = path.resolve(__dirname, '..') + "/public/images/posts/" + imageName + '.' + type
      uploadImage.mv(uploadPath, async () => {
        
        if(req.body.description){
        
          const post = await Post.create({
            description: req.body.description,
            userId : req.session.userID,
            user: req.session.userID,
            image: '/images/posts/' + imageName + '.' + type
          })
        }else{
          console.log("yazi yok");
          const post = await Post.create({ 
            userId : req.session.userID,
            user: req.session.userID,
            image: '/images/posts/' + imageName + '.' + type
          })
        }
      })
    } else if(req.body.description){ 
      const post = await Post.create({
        description: req.body.description,
        userId : req.session.userID,
        user: req.session.userID
      })
    }else{
      req.flash('error', "Something Happened")
      res.status(400).redirect('/')
    }
 
    req.flash('success', ` ${req.body.name} has been created successfully`)
    res.status(201).redirect('/')
  } catch (error) {
    req.flash('error', "Something Happened")
    res.status(400).redirect('/posts')
  }
}

exports.likePost = async (req, res) => {
  try {

    var postId = req.body.postid
    console.log(postId);
    //alttaki satırda giriş yapan kullnıcının following dizisine takip etmek istediği profilin idsini eklemekte
    const post = await Post.findById(postId)
    await post.like.push({ _id: req.session.userID })

    for(let i = 0; i<post.like.length ; i++ ){
      if(post.like[i] ==   req.session.userID ){
        console.log("beğenen o ");
      }else{
        console.log("Beğenen o değil");
      }
     
    }
    await post.save()

    res.status(200).redirect('back')
  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}

exports.unlikePost = async (req, res) => {
  try {
    var postId = req.body.postid
    console.log(postId);
    //alttaki satırda giriş yapan kullnıcının following dizisine takip etmek istediği profilin idsini eklemekte
    const post = await Post.findById(postId)
    await post.like.pull({ _id: req.session.userID })

    for(let i = 0; i<post.like.length ; i++ ){
      if(post.like[i] ==   req.session.userID ){
        console.log("beğenen o ");
      }else{
        console.log("Beğenen o değil");
      }
     
    }
    await post.save()

    

    res.status(200).redirect('back')
  } catch (error) {
    res.status(201).json({
      status: 'failss',
      error
    })
  }
}


exports.deletePost = async (req, res) => {
  try {  
      await Post.findByIdAndRemove({ _id: req.params.id })
    
    
    req.flash('success', 'has been created successfully')
    res.status(200).redirect('back')

  } catch (error) {
    res.status(201).json({
      status: 'fail',
      error
    })
  }
}



exports.updatePost = async (req, res) => {
  try {
      console.log(req.params.id); 

        const uploadDir = 'public/images/posts'
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir)
        }

        var postImage = ''
        if (!(!req.files || Object.keys(req.files).length === 0)) {
          let uploadImage = req.files.image
          const type = uploadImage.mimetype.slice(
            uploadImage.mimetype.search('/') + 1
          )
          const imageName = Math.floor(Math.random() * 1000000000000000000)
          // let uploadPath = __dirname + "/public/uploads/" + uploadImage.name
          let uploadPath =
            path.resolve(__dirname, '..') +
            '/public/images/posts/' +
            imageName +
            '.' +
            type
          uploadImage.mv(uploadPath)
          postImage = '/images/posts/' + imageName + '.' + type
        } else {
          postImage = req.body.old_img
        }

        console.log('image adresi :', postImage)

 
    const post = await Post.findById( req.params.id  )
      post.description = req.body.description
      post.image = postImage
      post.save()


    req.flash('success', 'has been created successfully')
    res.status(200).redirect('back')

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error
    })
  }
}

























exports.getAllPosts = async (req, res) => {
  try {
    const categorySlug = req.query.categories
    const category = await Category.findOne({ slug: categorySlug })
    const query = req.query.search

    let filter = {};

    if (categorySlug) {
      filter = { category: category._id }
    }

    if (query) {
      filter = { name: query }
    }

    if (!query && !categorySlug) {
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





