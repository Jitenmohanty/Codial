const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  try {
   let post= await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if(req.xhr){
      return res.status(200).json({
        data:{
          post:post
        },
        message:'Post is Created'
      })
    }
    req.flash('success',"Post Published!");
    return res.redirect("back");
  } catch (error) {
    req.flash('error',error);
    return res.redirect("back");
    
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    //.id means convert object id into string
    if (post.user == req.user.id) {
      post.remove();
      
      await Comment.deleteMany({ post: req.params.id });
      req.flash('success',"Post and associated Comment Deleted!");
      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    req.flash('success',"You con't delete this post!");
    return res.redirect("back");
    
  }
};
