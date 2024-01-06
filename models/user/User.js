const mongoose=require('mongoose');

// schema represent blueprint of which we can create instances of object
const userSchema=new mongoose.Schema(
    {
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    // this is optional
    profileImage:{
        type:String,
    },
    coverImage:{
        type:String,
    },

role:{
    type:String,
    default:"Blogger",
},
bio:{
    type:String,
    default:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nostrum adipisci eligendi nobis itaque ex? Veniam tempore itaque cumque fugiat iusto voluptatibus odit inventore dolorem numquam maxime, repellendus labore corrupti expedita?",
},


// we are referencing the post id 
// we can save the post using embeded or refrencing method
// relate user to post as user can create multiple posts
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post",       // it take refernce from post 
        }
    ],



    // relate user to comment as single user can do multiple comments
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment",       // it take refernce from post 
        }
    ],

},
{
    timestamps:true,      // it help us to automatically add the date when the document was created and the document was updated 
}
);




// compile schema to form a model
const User=mongoose.model("User",userSchema);

module.exports=User;