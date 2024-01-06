const express = require("express");
const multer=require('multer');
const storage = require("../../config/cloudinary");
const {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
} = require("../../controllers/users/users");
const protected=require('../../middlewares/protected');



const userRoutes = express.Router();


// intstance of multer
const upload=multer({storage});

// on Router we have all the http methods


// rendering forms

// render login form
userRoutes.get('/login',(req,res)=>{
  res.render('users/login',{
    error:""
  });
});


// render register form
userRoutes.get('/register',(req,res)=>{
  res.render('users/register',{
    error:""
  });
});


// // render profile page
// userRoutes.get('/profile-page',(req,res)=>{
//   res.render('users/profile');
// });



// upload profile photo
userRoutes.get('/upload-profile-photo-form',(req,res)=>{
  res.render('users/uploadProfilePhoto',{error:""});
});




// upload cover photo
userRoutes.get('/upload-cover-photo-form',(req,res)=>{
  res.render('users/uploadCoverPhoto',{error:""});
});




// render update user form
userRoutes.get('/update-user-password',(req,res)=>{
  res.render('users/updatePassword',{error:""});
});


// register
userRoutes.post("/register",upload.single('profile'), registerCtrl);

// POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);



// details about the user  it is private   -> it is belong to creator only
// GET/api/v1/users/profile
userRoutes.get("/profile-page",protected, profileCtrl);

// for uploading profile image means we are updating the user property
// PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload/",protected,upload.single('profile'), uploadProfilePhotoCtrl);

// for uploading cover image means we are updating the user property
// PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/cover-photo-upload/",protected,upload.single('profile'), uploadCoverImgCtrl);

// for updating the user password
// PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/", updatePasswordCtrl);

// for updating the user
// PUT/api/v1/users/update/:id
userRoutes.put("/update",updateUserCtrl);



// for logout
// GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);

// details about the user  it is public -> if a user is viewing the post that person view the creator of the post
// GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);



module.exports = userRoutes;
