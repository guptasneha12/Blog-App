const mongoose=require("mongoose");

const postSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },

        description:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true,
            // accepted category
            enum:['react js','html','css','node js','javascript','other'],
        },
        image:{
            type:String,
            required:true,
        },
        

        // relate post to user as single post is created by the single user 
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },


        // relate post to comment as single post has multiple comments
        comments:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment',
        }
    ]

},{
    timestamps:true,
});

// compile schema to form model

const Post=mongoose.model('Post',postSchema);

// export model
module.exports=Post;