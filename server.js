// configure dotenv
require("dotenv").config();
const express = require("express");
const session=require('express-session');
const MongoStore=require("connect-mongo");     // to store the session into mongodb so that after every restart of server the session get do not expires
const userRoutes = require("./routes/users/users");
const postRoutes = require("./routes/posts/posts");
const commentRoutes = require("./routes/comments/comments");
const globalErrHandler = require("./middlewares/globalHandler");
const methodOverride=require('method-override');
const Post = require("./models/post/Post");
const { truncatePost } = require("./utils/helpers");
require("./config/dbConnect");

// configure dotenv
// dotenv.config();

// creating instance of express
const app = express(); // this will provide all the properties and methods of express
// console.log(app);


// helpers
app.locals.truncatePost=truncatePost;



// middelwares
app.use(express.json());     // pass incoming json data

// configure express to display the incoming data from client or pass form data
app.use(express.urlencoded({extended:true}));


// configure ejs
app.set('view engine','ejs');


// serve static file that is present in public folder
app.use(express.static(__dirname, + "/public"));     // this is dynamic path name


// method override config
app.use(methodOverride("_method"));

// session configuration
app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store:new MongoStore({
        mongoUrl:process.env.MONGO_URL,
        ttl: 24 * 60 * 60  // expires the session in one day
    }),
}))



// save the login user into local
// this middleware will always run anytime we make a request or as soon as our application runs it also runs
app.use((req,res,next)=>{
if(req.session.userAuth){
    // add the user into the locals
    res.locals.userAuth=req.session.userAuth;
}
else{
    res.locals.userAuth=null;
}
next();
})


// render home page
app.get('/',async(req,res)=>{
try {
    const posts=await Post.find().populate('user');
    res.render('index',{posts});
} catch (error) {
    res.render('index',{error:error.message});
}
    
});





// app.use() accept any http methods and return same response for all routes
// users route
app.use("/api/v1/users", userRoutes);
//  it appends our routes and our route become => /api/something/api/v1/users/register
// the first URL is the base URL

// routes

// // 1. users route
// // POST/api/v1/users/register
// app.post('/api/v1/users/register',async(req,res)=>{
// try {
//     res.json({
//         status:"Success",
//         user:"User registered",
//     })
// } catch (error) {
//     res.json(error);
// }
// });

// // POST/api/v1/users/login
// app.post('/api/v1/users/login',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"User login",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

// // details about the user  it is public -> if a user is viewing the post that person view the creator of the post
//     // GET/api/v1/users/:id
// app.get('/api/v1/users/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"User details",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//     // details about the user  it is private   -> it is belong to creator only
//     // GET/api/v1/users/profile/:id
// app.get('/api/v1/users/profile/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"User Profile",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//     // for uploading profile image means we are updating the user property
//         // PUT/api/v1/users/profile-photo-upload/:id
// app.put('/api/v1/users/profile-photo-upload/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"User profile photo uploaded",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//         // for uploading cover image means we are updating the user property
//         // PUT/api/v1/users/profile-photo-upload/:id
// app.put('/api/v1/users/cover-photo-upload/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"User cover photo uploaded",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//           // for updating the user password
//         // PUT/api/v1/users/update-password/:id
// app.put('/api/v1/users/update-password/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"User password updated",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//     // for updating the user
//         // PUT/api/v1/users/update/:id
//         app.put('/api/v1/users/update/:id',async(req,res)=>{
//             try {
//                 res.json({
//                     status:"Success",
//                     user:"User updated",
//                 })
//             } catch (error) {
//                 res.json(error);
//             }
//             });

//           // for logout
//         // GET/api/v1/users/logout
// app.get('/api/v1/users/logout',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:" User logout",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

// 2. posts route

app.use("/api/v1/posts", postRoutes);

// // POST/api/v1/posts
// app.post('/api/v1/posts',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Post Created",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

// // GET/api/v1/posts    means fetch all post
// app.get('/api/v1/posts',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Posts list",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//     // to get the details of post
//     // GET/api/v1/posts/:id
// app.get('/api/v1/posts/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Posts details",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//        // DELETE/api/v1/posts/:id
// app.delete('/api/v1/posts/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Posts deleted",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//            // PUT/api/v1/posts/:id
// app.put('/api/v1/posts/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Posts updated",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

// 3. comment route

app.use("/api/v1/comments", commentRoutes);
// // POST/api/v1/comments
// app.post('/api/v1/comments',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Comment Created",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//     // GET/api/v1/comments/:id
// app.get('/api/v1/comments/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Comments details",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//        // DELETE/api/v1/comments/:id
// app.delete('/api/v1/comments/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Comment deleted",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });

//            // PUT/api/v1/comments/:id
// app.put('/api/v1/comments/:id',async(req,res)=>{
//     try {
//         res.json({
//             status:"Success",
//             user:"Comment updated",
//         })
//     } catch (error) {
//         res.json(error);
//     }
//     });






// error handler middlewares
app.use(globalErrHandler);





// listen server
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
