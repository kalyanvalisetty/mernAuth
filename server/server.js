import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";


const app = express()
const port = process.env.PORT || 4000;
const allowedOrigins = ['https://mernauth-jwt.onrender.com']

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));


//API Endpoints
app.get('/',(req,res)=>{
    res.send("API WORKING");
})
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`server is running at port: ${port}`)
    });
})
.catch((err)=>console.error(err.message))
