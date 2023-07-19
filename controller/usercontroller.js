const User = require("./../models/user");
const Blog = require("./../models/blog");
const path = require('path')
module.exports = {
  signup: async (req, res, next) => {
    try {
      const email = req.body.email;
      console.log(email);
      const checkuser = await User.findOne({ email: req.body.email });
      console.log(checkuser);
      if (checkuser !== null) {
        res.status(200).json({
          message: "user already exists",
        });
      }
      console.log("it is a else block");
      const newuser = new User({
        username: req.body.username,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        isadmin:req.body.isadmin
      });
      const saveduser = await newuser.save();
      res.status(200).json({
        message: "user registered successfully",
        user: saveduser,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
      console.log(error);
    }
  },
  signin: async (req, res, next) => {
    try {
      const email = req.body.email;
      const checkuser = await User.findOne({ email: email });
      if (!checkuser) {
        const err = new Error("user not found", 404);
        next(err);
      }
      const passwordcheck = await checkuser.comparepass(
        req.body.password,
        checkuser.password
      );
      if (!passwordcheck) {
        const err = new Error("your password is incorrect", 403);
        next(err);
      }
      req.session.user = checkuser;
      console.log(req.session.user._id);
      res.status(200).json({
        message: "user log in successfully",
        user: checkuser,
        cookies: req.cookies,
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res) => {
    req.session.destroy();
    res.status(200).json({
      message: "user logout successfully",
    });
  },
  addblog: async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    if (!title) {
      const err = new Error(
        "title not found please provide title of your content",
        404
      );
      next(err);
    }
    if (!content) {
      const err = new Error(
        "content not found please provide a minimum amount of content to fullfill your blog",
        404
      );
      next(err);
    }
    const blog = new Blog({
      title: title,
      content: content,
      author: req.session.user._id,
    });
    const savedblog = blog
      .save()
      .then(() => {
        res.status(200).json({
          message: "blog add successfully",
          blog: savedblog,
        });
      })
      .catch((err) => {
        next(err);
      });
  },
  like: async (req, res) => {
    const blogid = req.params.id;
    console.log(blogid);
    const like = await Blog.findByIdAndUpdate(
      blogid,
      { $push: { like: req.session.user._id } },
      { new: true }
    );
    if (like) {
      res.status(200).json({
        message: "user liked blog successfully",
        like,
      });
    } else {
      const err = new Error("something wrong", 400);
      next(err);
    }
  },
  allblogs: async (req, res) => {
    const allblogs = await Blog.aggregate([
      {
        $group: {
          _id: "$_id",
          title:{$first:"$title"},
          content: {$first:'$content'},
          comments:{$first:'$comment'},
          totallikes: {$sum:{ $size: "$like" }},
          totalcomments :{$sum:{$size:'$comment'}}
        },
      },
    ]);
    res.status(200).json({
      message: "all blogs",
      blogs: allblogs,
    });
  },
  comment: async (req, res, next) => {
    try {
      const blogid = req.params.id;
    console.log(blogid + req.session.user._id);
    const comment = req.body.comment;
    console.log(comment)
    if(!comment)
    {
      const err = new Error('comment not found please write some for a understandable think',404)
      next(err);
    }
    const commentedblog = await Blog.findByIdAndUpdate(blogid,{$push:{comment:{content:comment,author:req.session.user._id}}});
    if(!commentedblog){
      const err = new Error('something wrong',500);
      next(err);
    }
    res.status(200).json({
      message:"you comment on this blog",
      comment:commentedblog
    })
    } catch (error) {
      next(error);
    }
  },
  profile:async (req,res)=>{
    if(req.isAuthenticated()){
      const user = req.user;
      req.session.user = user;
      res.redirect('/home')
    }
  },
  home:async (req,res)=>{
    console.log(__dirname+'/public/googlesign.html')
    res.sendFile(path.join(__dirname+'./../public/googlesign.html'))
  },
  deleteblog:async (req,res)=>{
    
  }
};
