const express=require('express');

const { createPostCtrl, fetchPostsCtrl,fetchPostCtrl, deletePostCtrl, updatePostCtrl } = require('../../controllers/posts/posts');
const postRoutes=express.Router();
const protected=require('../../middlewares/protected');
const multer = require('multer');
const storage = require('../../config/cloudinary');
const Post = require('../../models/post/Post');



// instance of multer
const upload=multer({
    storage,
});



// forms
postRoutes.get('/get-post-form',(req,res)=>{
    res.render('posts/addPost',{error:""});
})


postRoutes.get('/get-form-update/:id',async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        res.render('posts/updatePost',{
            post,
            error:""
        })
    } catch (error) {
        res.render('posts/updatePost',{
            post:"",
            error
        })
    }
})

postRoutes.post('/',protected,upload.single('file'),createPostCtrl);



// GET/api/v1/posts    means fetch all post 
postRoutes.get('/',fetchPostsCtrl);


    // to get the details of post
    // GET/api/v1/posts/:id   
postRoutes.get('/:id',fetchPostCtrl);



       // DELETE/api/v1/posts/:id   
postRoutes.delete('/:id',protected,deletePostCtrl);



           // PUT/api/v1/posts/:id   
postRoutes.put('/:id',protected,upload.single('file'),updatePostCtrl);


    module.exports=postRoutes;