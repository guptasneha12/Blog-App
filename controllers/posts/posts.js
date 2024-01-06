const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");



// create post
const createPostCtrl= async(req,res,next)=>{
    const {title,description,category,user,image}=req.body;
    try {
        if(!title || !description || !category || !req.file){
return res.render('posts/addPost',{error:"All Fields are required"});
        }
        // find the user
        const userId=req.session.userAuth;
        const userFound=await User.findById(userId);
        // create the post
        const postCreated=await Post.create({
            title,
            description,
            category,
            user:userFound._id,
            image:req.file.path,
        });
// push the post created into the array of users post
userFound.posts.push(postCreated._id);

// resave the user
await userFound.save();

        // console.log(userId);
       res.redirect('/');
    } catch (error) {
        
        return res.render('posts/addPost',{error:error.message});

    }
    };




    // fetch all posts
   const fetchPostsCtrl= async(req,res,next)=>{
        try {
            const posts=await Post.find().populate('comments').populate('user');
            res.json({
                status:"Success",
                data:posts,
            })
        } catch (error) {
            return next(appErr(error.message));
        }
        };





// details  fetch the single post
    const fetchPostCtrl= async(req,res,next)=>{
            try {
                // get the id from params
                 const id=req.params.id;
                 // find the post
                 const post=await Post.findById(id).populate({
                    path:'comments',
                    populate:{
                        path:'user',
                    },
                 }).populate('user');
                res.render('posts/postDetails',{
                    post,
                  
                    error:"",
                });
            } catch (error) {
               return next(appErr(error.message));
            }
            };



            // delete post
             const deletePostCtrl= async(req,res,next)=>{
                try {
                    // find the post
                    const post=await Post.findById(req.params.id);
                    // check if the post belongs to the user
                    // if the user is the login user then only they can delete their post
                    if(post.user.toString() !== req.session.userAuth.toString()){
return res.render('posts/postDetails',{
    error:"You are not authorized to delete this post",
    post,
});
                    }


                    // delete post
                    const deletedPost=await Post.findByIdAndDelete(req.params.id);
                   res.redirect('/');
                } catch (error) {
                    return res.render('posts/postDetails',{
                        error:error.message,
                        post:""
                    });
                }
                };




                // update post
               const updatePostCtrl= async(req,res,next)=>{
                // destructure the fields we wan to update
                const {title,description,category}=req.body;
               
                    try {
                        // find the post
                    const post=await Post.findById(req.params.id);
                    // check if the post belongs to the user
                    // if the user is the login user then only they can update their post
                    if(post.user.toString() !== req.session.userAuth.toString()){
                        return res.render('posts/updatePost',{
                            post:"",
                            error:"You are not authorized to update this post"
                        });

                    }
                    // check if user is updating image
                    if(req.file){
                                            // update the post
                    await Post.findByIdAndUpdate(req.params.id,{
                        title,
                        description,
                        category,
                        image:req.file.path,
                    },{
                      new:true,  
                    });
                    }else{
                                                 // update the post
                    await Post.findByIdAndUpdate(req.params.id,{
                        title,
                        description,
                        category,
                        
                    },{
                      new:true,  
                    });
                    }



                  


                        res.redirect('/');
                    } catch (error) {
                        return res.render('posts/updatePost',{
                            post:"",
                            error:error.message
                        });
                    }
                    }





    module.exports={
        createPostCtrl,
        fetchPostsCtrl,
        fetchPostCtrl,
        deletePostCtrl,
        updatePostCtrl,
    }