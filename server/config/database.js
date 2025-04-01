import mongoose from "mongoose";

const connectDB = async()=> {
   //Event on mongoose
     mongoose.connection.on('connected', ()=>{
        console.log("Connected to Database");
     })
     await mongoose.connect(`${process.env.MONGODB_URI}/mernauth`);
}

export default connectDB