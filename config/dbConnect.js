const mongoose=require('mongoose');

const dbConnect=async()=>{
    // console.log(process.env);
   
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Connected Successfully');

    } catch (error) {
        console.log('DB Connection Failed',error.message);
    }
};



// module.exports=dbConnect;
dbConnect();