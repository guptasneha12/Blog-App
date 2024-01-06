require('dotenv').config()
const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');


// configure clodinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY,

});


// create instance of cloudinary storage
const storage=new CloudinaryStorage({
    cloudinary,
    // file type we want to accept
    allowedFormats:['jpg','jpeg','png'],
    // save the file in specific folder in cloudinary
    params:{
folder:'blog-app-v3',
transformation:[{width:500,height:500,crop:"limit"}],
    }
});



module.exports=storage;

// we want to pass this storage as middleware where we want to upload file