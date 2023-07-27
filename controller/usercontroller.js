const User = require("./../models/user.js");
const Blog = require("./../models/blog");
const errorhandler = require('./../middleware/errorhandler')
const path = require('path')
const jwt = require('jsonwebtoken');
const { json } = require("body-parser");
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ node: 'http://localhost:9200' });
module.exports = {
  signup: async (req, res, next) => {
    try {
      const email = req.body.email;
      console.log(email);
      const checkuser = await User.findOne({ email: req.body.email });
      console.log(checkuser);
      if (checkuser !== null) {
        const err = new errorhandler(
          "user already exists",
          403,
          "BAD REQUEST",
          { addtionaldata: "please sign in because you already registerd" }
        );
        next(err);
      }
      console.log("it is a else block");
      const newuser = new User({
        username: req.body.username,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        isadmin: req.body.isadmin,
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
    }
  },
  signin: async (req, res, next) => {
    try {
      const email = req.body.email;
      const checkuser = await User.findOne({ email: email });
      if (!checkuser) {
        const err = new errorhandler("user Not found", 404, "NOT FOUND", {
          addtionaldata: "please enter right information",
        });
        next(err);
      }
      const passwordcheck = await checkuser.comparepass(
        req.body.password,
        checkuser.password
      );
      if (!passwordcheck) {
        const err = new errorhandler(
          "wrong password",
          403,
          "password not match",
          { addtionaldata: "Your email or password incorrect" }
        );
        next(err);
      }
      req.session.user = checkuser;
      const token = await jwt.sign({userid:checkuser._id},process.env.JWT_SECRET,{expiresIn:'1m'});
      req.user=checkuser;
      console.log(req.session.user._id);
      res.status(200).json({
        message: "user log in successfully",
        user: checkuser,
        token,
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
    console.log(title)
    const content = req.body.content;
    const currentuser = await User.findOne({ _id: req.session.user._id });
    if (!title) {
      const err = new errorhandler("title not found", 404, "NOT FOUND", {
        addtionaldata: "please provide title of your blog",
      });
      next(err);
    }
   for(let i =0;i<currentuser.blogs.length;i++){
    const blogid =  currentuser.blogs[i];
    const blog = await Blog.findOne({_id:blogid})
     if(blog){
      console.log(blog.title)
      if(title == blog.title){
        const err = new errorhandler("Blog already exists",403);
       next(err);
      }
     }
   }
    if (!content) {
      const err = new errorhandler("content not found", 404, "NOT FOUND", {
        addtionaldata: "please enter specific amount of content data",
      });
      next(err);
    }
    const blog = new Blog({
      title: title,
      content: content,
      author: req.session.user._id,
    });
    blog
      .save()
      .then(async (savedblog) => {
        const blogid = savedblog._id;
        const newuser = await User.findByIdAndUpdate(req.session.user._id, {
          $push: { blogs: blogid },
        });
        res.status(200).json({
          message: "blog add successfully",
          blog: savedblog,
          newuser,
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
      const err = new errorhandler(
        "somthing went wrong",
        500,
        "INTERNAL SERVER ERROR",
        { addtionaldata: "SOME INTER ISSUE" }
      );
      next(err);
    }
  },
  allblogs: async (req, res) => {
    const allblogs = await Blog.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          content: { $first: "$content" },
          comments: { $first: "$comment" },
          totallikes: { $sum: { $size: "$like" } },
          totalcomments: { $sum: { $size: "$comment" } },
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
      console.log(comment);
      if (!comment) {
        const err = new errorhandler(
          "comment not found blank comment not acceptable",
          403,
          "BAD REQUEST",
          { addtionaldata: "please write some comment" }
        );
        next(err);
      }
      const commentedblog = await Blog.findByIdAndUpdate(blogid, {
        $push: { comment: { content: comment, author: req.session.user._id } },
      });
      if (!commentedblog) {
        const err = new errorhandler(
          "somthing went wrong",
          500,
          "INTERNAL SERVER ERROR",
          { addtionaldata: "SOME INTER ISSUE" }
        );
        next(err);
      }
      res.status(200).json({
        message: "you comment on this blog",
        comment: commentedblog,
      });
    } catch (error) {
      next(error);
    }
  },
  profile: async (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      req.session.user = user;
      res.redirect("/home");
    }
  },
  home: async (req, res) => {
    console.log(__dirname + "/public/googlesign.html");
    res.render(path.join(__dirname + "./../public/googlesign.ejs"),{user:req.session.user});
    
  },
  deleteblog: async (req, res, next) => {
    try {
      const blogid = req.params.id;
      const deleteblog = await Blog.findByIdAndUpdate(
        { _id: blogid },
        { isDeleted: true }
      );
      if (!deleteblog) {
        const err = new errorhandler(
          "somthing went wrong",
          500,
          "INTERNAL SERVER ERROR",
          { addtionaldata: "SOME INTER ISSUE" }
        );
        next(err);
      }
      res.status(200).json({
        message: "blog deleted",
        deleteblog,
      });
    } catch (error) {
      next(error);
    }
  },
  searchdata:async (req,res,next)=>{
    const query = req.body.query;
    const {body:response} = await client.search({
      index:"username",
      body:{
        query:{
          match:{
            username:'gursevak'
          }
        }
      }
    })
    console.log(response.hits.hits)
  }
};
