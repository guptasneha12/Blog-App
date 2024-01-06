
const Post=require('../../models/post/Post');
const User=require('../../models/user/User');
const Comment=require('../../models/comment/Comment');
const appErr = require("../../utils/appErr");



// create comment
const createCommentCtrl= async(req,res,next)=>{
    const {message}=req.body;
    try {
        // find the post
const post=await Post.findById(req.params.id);
// create the comment
const comment=await Comment.create({
    user:req.session.userAuth,
    message,
    post:post._id,
});
// push the comment to the post
post.comments.push(comment._id);
// find the user and push the comment into array of post
const user=await User.findById(req.session.userAuth);

// push the comment into  the post of user
user.comments.push(comment._id);
// resave the post
// disable the validation
// save
await post.save({validationBeforeSave:false});
await user.save({validationBeforeSave:false});
console.log(post);
       res.redirect(`/api/v1/posts/${post._id}`);
    } catch (error) {
        return next(appErr(error)); 
    }
    };


// find single comment
    const commentDetailsCtrl =async(req,res,next)=>{
        try {
            const comment=await Comment.findById(req.params.id);
           res.render('comments/updateComment',{
            comment,
            error:"",
           })
        } catch (error) {
            res.render('comment/updateComment',{
                
                error:error.message,
               }) 
        }
        };




        // delete comment
       const deleteCommentCtrl= async(req,res,next)=>{
        console.log(req.query.postId);
        try {
            // find the post
            const comment=await Comment.findById(req.params.id);
            // check if the comment belongs to the user
            // if the user is the login user then only they can delete their post
            if(comment.user.toString() !== req.session.userAuth.toString()){
return next(appErr("You are not allowed to delete this comment",403));
            }


            // delete post
            const deletedCommentt=await Comment.findByIdAndDelete(req.params.id);
            res.redirect(`/api/v1/posts/${req.query.postId}`);
        } catch (error) {
                return next(appErr(error));
            }
            };




            // update comment
           const updateCommentCtrl= async(req,res,next)=>{
            try {
                // find the comment
            const comment=await Comment.findById(req.params.id);
if(!comment){
    return next(appErr('Comment not found'));
}


            // check if the post belongs to the user
            // if the user is the login user then only they can update their post
            if(comment.user.toString() !== req.session.userAuth.toString()){
return next(appErr("You are not allowed to update this comment",403));
            }
            // update the comment
            const commentUpdated=await Comment.findByIdAndUpdate(req.params.id,{
              message:req.body.message,
              
                           },{
              new:true,  
            });

            res.redirect(`/api/v1/posts/${req.query.postId}`);
            } catch (error) {
                   return next(appErr(error));                }
                };



                module.exports={
                    createCommentCtrl,
                    commentDetailsCtrl,
                    deleteCommentCtrl,
                    updateCommentCtrl,
                }