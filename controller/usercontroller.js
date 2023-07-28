const User = require("./../models/user.js");
const Blog = require("./../models/blog");
const errorhandler = require('./../middleware/errorhandler')
const path = require('path')
const jwt = require('jsonwebtoken');
const { json } = require("body-parser");
const { Client } = require('@elastic/elasticsearch');
const createbulk = require('./../middleware/createbulk.js')
const client = new Client({ node: 'http://localhost:9200' });
const emailVerification = require('./../middleware/emailVerification.js');
module.exports = {
  signup: async (req, res, next) => {
    try {
      const email = req.body.email;
      const checkuser = await User.findOne({ email: req.body.email });
      if (checkuser !== null) {
        const err = new errorhandler(
          "user already exists",
          403,
          "BAD REQUEST",
          { addtionaldata: "please sign in because you already registerd" }
        );
        next(err);
      }
      const newuser = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        isadmin: req.body.isadmin,
      });
      const saveduser = await newuser.save();
      if(!saveduser){
        const err = new errorhandler('user not saved');
        next(err);
      } 
      if(saveduser){
       emailVerification(saveduser.email,saveduser.username);
        res.status(200).json({
          message: "you are registered successfully please verify your email",
          user: saveduser,
        });
      }
    } catch (error) {
      next(error)
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
      if(req.session.user){
      const token =  jwt.sign({userid:checkuser._id},process.env.JWT_SECRET,{expiresIn:'1m'});
      req.user=checkuser;
      console.log(req.session.user._id);
      res.status(200).json({
        message: "user log in successfully",
        user: req.session.user,
        token,
        cookies: req.cookies,
      });
    }
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
  like: async (req, res,next) => {
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
  searchdata: async (req,res)=>{
    try {
      const q = req.body.query;
      await createbulk.createbulk();
      const {body:searchresponse} = await client.search({
        index:"data",
        body:{
          query:{
            match:{
              username:q
            }
          }
        }
      })
      console.log(searchresponse)
      res.json({data:searchresponse.hits.hits})
    }
    catch (error) {
      console.log(error.message)
    }
  },
  searchblogdata:async (req,res,next)=>{
    try {
      await createbulk.createBlogBluk()
    const title = req.body.title;
    const content = req.body.content;
    const {body:response } = await client.search({
      index:'blog',
      body:{
        query:{
          match:{
            // title:title,
             content:content
          }
        }
      }
    })
    console.log(response.hits.hits);
    res.json({data:response.hits.hits})
  
    } catch (error) {
      console.log(error.message);
    }
}
}