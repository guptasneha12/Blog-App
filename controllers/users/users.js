const bcrypt=require('bcryptjs');   // used for hasing password
const User=require('../../models/user/User');
const appErr = require('../../utils/appErr');



// register
const registerCtrl = async (req, res,next) => {
  const {fullname,email,password}=req.body;
  console.log(req.body);

  // // check if field is empty
  // if(!fullname || !email || !password) {
  //   return next(appErr('All fields are required'));
  // }



    // check if field is empty then redirect the user to the registration page
    if(!fullname || !email || !password) {
      return res.render('users/register',{
        // object
        error:"All fields are required",
      });
    }
  


  try {
    // 1. check if user already exist or not by using email
const userFound=await User.findOne({email});
//throw error
if(userFound){
  return res.render('users/register',{
    // object
    error:"User already exists",
  });
  
}

// if user does't exist the hash the password
// Hash the user password
const salt=await bcrypt.genSalt(10);
const passwordHashed=await bcrypt.hash(password,salt);
// register user
const user= await User.create({
  fullname,
  email,
  password:passwordHashed,
});

console.log(user);
   // redirect after registration to  profile page
   res.redirect('/api/v1/users/profile-page');
   
  } catch (error) {
    res.json(error);
  }
};



// login
const loginCtrl = async (req, res,next) => {
  // console.log(req.session.loginUser='emma');
  const {email,password}=req.body;
  if(!email || !password){
    return res.render('users/login',{
      // object
      error:"Email and password fields are required",
    });
  }


  try {
    // check if email exist
    const userFound=await User.findOne({email});
    if(!userFound){

      return res.render('users/login',{
        // object
        error:"Invalid Login Credentials",
      });
    }

// verify password
const isPasswordValid=await bcrypt.compare(password,userFound.password);
if(!isPasswordValid){
  return res.render('users/login',{
    // object
    error:"Invalid Login Credentials",
  });
}


// save the login user into the session
req.session.userAuth=userFound._id;
console.log(req.session);
     // redirect user after login to  profile page
   res.redirect('/api/v1/users/profile-page');
   
  } catch (error) {
    res.json(error);
  }
};




//details   these details can be viewed by any users and can not be updated by other users
const userDetailsCtrl = async (req, res) => {
  try {
    // console.log(req.params);

    // get user id from params
    const userId=req.params.id;
    // find the user
    const user=await User.findById(userId);


    res.render('users/updateUser',{
      user,
      error:"",
    });
  } catch (error) {
    res.render('users/updateUser',{
     
      error:error.message,
    });
  }
};





//profile
const profileCtrl = async (req, res) => {
  try {
    
    // get the login user
    const userID=req.session.userAuth;

    // find the user
    const  user=await User.findById(userID).populate('posts').populate('comments');
    
res.render('users/profile',{user});
  } catch (error) {
    res.json(error);
  }
};




// upload profile photo
 const uploadProfilePhotoCtrl=async (req, res,next) => {
  // console.log(req.file.path);
    try {
      //check if user is uploading a picture
      if(!req.file){
        // return next(appErr("User not found",403));
        return res.render('users/uploadProfilePhoto',{
          error: "Please upload image",
        });
      }
      // 1. find the user to be updated
      const userId=req.session.userAuth;
      const userFound=await User.findById(userId);
      // 2. if user is not found
      if(!userFound){
        return res.render('users/uploadProfilePhoto',{
          error: "User not found",
        })
      }
      // update the user profile photo
      await User.findByIdAndUpdate(userId,{
        profileImage:req.file.path,
      },{
        new:true,
      });
      //redirect
    res.redirect('/api/v1/users/profile-page');
    } catch (error) {

      return res.render('users/uploadProfilePhoto',{
        error:error.message,
      });
    }
  };


  

//   // upload cover photo
 const uploadCoverImgCtrl= async (req, res) => {
  try {
    //check if user is uploading a picture
    if(!req.file){
      // return next(appErr("User not found",403));
      return res.render('users/uploadProfilePhoto',{
        error: "Please upload image",
      });
    }
    // 1. find the user to be updated
    const userId=req.session.userAuth;
    const userFound=await User.findById(userId);
    // 2. if user is not found
    if(!userFound){
      return res.render('users/uploadProfilePhoto',{
        error: "User not found",
      })
    }
    // update the user profile photo
    await User.findByIdAndUpdate(userId,{
      coverImage:req.file.path,
    },{
      new:true,
    })
    res.redirect('/api/v1/users/profile-page');
  } catch (error) {
    return res.render('users/uploadProfilePhoto',{
      error:error.message,
    });
  }
  };



  // update password
 const updatePasswordCtrl= async (req, res,next) => {
  const {password}=req.body;
    try {
      // check if user is updating the password the hash  the new password
      if(password){
        const salt=await bcrypt.genSalt(10);
        const passwordHashed=await bcrypt.hash(password,salt);
         // update the user
      await User.findByIdAndUpdate(req.session.userAuth,{
        password:passwordHashed,
      },{
new:true,
      }
      );
       //redirect
    res.redirect('/api/v1/users/profile-page');
      }

     
    } catch (error) {
      return res.render('users/uploadProfilePhoto',{
        error: error.message,
      })
    }
  };


  
  
  // update user
 const updateUserCtrl= async (req,res,next) => {
  const {fullname,email}=req.body;

    try {
      // if their is not data
      if(!fullname || !email){
        return res.render('users/updateUser',{
          error:"Please provide details",
          user:"",
        });
      }
      // check  if email is not taken means it is new email
      if(email){
      const emailTaken=await User.findOne({email});
      if(emailTaken){
        return res.render('users/updateUser',{
          error:"Email is taken",
          user:"",
        });
      }
    }

    // if email is not taken then update the user
  await User.findByIdAndUpdate(req.session.userAuth,{
      // first take the id and then update
      // properties that we want to update are-
      fullname,
      email,
    },{
      new:true,     // if we want an updated record
    });

    res.redirect('/api/v1/users/profile-page');
    } catch (error) {
      return res.render('users/updateUser',{
        error:error.message,
        user:"",
      });
    }
  };



  // logout
 const logoutCtrl= async (req, res) => {
    // destroy the session when user logged out
    req.session.destroy(()=>{
      res.redirect('/api/v1/users/login');
    });
  };



// it returns multiple functions so we need to return it as an object
module.exports = {
  registerCtrl,
  loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhotoCtrl,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl,
};
