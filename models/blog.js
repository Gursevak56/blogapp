const mongoose = require('mongoose');
const blogschema = mongoose.Schema({
    title:{
        type:String
    },
    content:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    comment:[{
        content:String,
        author:{
            type:mongoose.Schema.Types.ObjectId,
        ref:'user'
        }
    }]
},{timestamp:true})
const Blog = mongoose.model('blog',blogschema);
module.exports = Blog;