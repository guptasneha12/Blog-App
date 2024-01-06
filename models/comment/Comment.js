const mongoose=require('mongoose');

// comment schema

const commentschema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,     // we are using the reference way
            required:true,
            ref:"User",    // we are referencing the user model
        },
        message:{
            type:String,
            required:true,
        },
        post:{
            type:mongoose.Schema.Types.ObjectId, 
            required:true,
            ref:'Post'
        }
},
{
    timestamp:true,
}
);



// compile schema to form model

const Comment=mongoose.model('Comment',commentschema);

// export model
module.exports= Comment;