import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from "../config/emailTemplates.js";

export const register = async(req,res)=>{
    const {userName, emailId, password} = req.body;

    if(!userName || !emailId || !password){
        return res.json({success: false, message: "Missing Details"});
    }
    try{
        const existingUser = await userModel.findOne({emailId});
        if(existingUser){
            return res.json({success: false, message: "Account already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({userName, emailId, password: hashedPassword});
        await user.save();
        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'lax', maxAge: 7*24*60*60*1000});
        res.json({success: true, message: "Account Created"})
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export const login = async(req, res)=>{
    const  {emailId, password} = req.body;
    if(!emailId || !password){
        return res.json({success: false, message: "Enter Email and Password"})
    }
    try{
        const user = await userModel.findOne({emailId});
        if(!user){
            return res.json({success: false, message: "Invalid Credentials"})
        }
        const isMatch = bcrypt.compareSync(password, user.password); 
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
<<<<<<< HEAD
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'strict', maxAge: 7*24*60*60*1000});
            
=======
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'lax', maxAge: 7*24*60*60*1000});

>>>>>>> 360c62c18530587ee3f3f8138dcc98651d9ae1bc
        return res.json({success: true, message: "Verify Email to Login"});

    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export const logout = async(req,res)=>{
    try{
        const {userId} = req.body;
    const user = await userModel.findById(userId);
    user.isAccountVerified = false;
    await user.save();
        res.clearCookie('token',{httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production'? 'none': 'lax'})
        return res.json({success: true, message: "Logged Out"});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export const authenticated = async(req,res)=>{
    try{
        return res.json({success: true, message: "Authenticated"});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

//OTP to verify Email
export const sendVerifyOtp = async(req,res)=>{
    try{
    const {userId} = req.body;
    const user = await userModel.findById(userId);
    if(user.isAccountVerified){
        return res.json({success: false, message: 'Account is Already Verified'})
    }
    const otp = String(Math.floor(100000 + Math.random()*900000));
    
    user.verifyOtp = otp;
    user.verifyOtpExpiredAt = Date.now()+ 24*60*60*1000;

    await user.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.emailId,
        subject: 'Account Verification OTP',
        text: `Your OTP is ${otp}, verify Your Account using this OTP`,
        html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.emailId)
    }
    await transporter.sendMail(mailOptions);
    res.json({success: true, message: "Verification OTP sent"})

    }catch(err){
        res.json({success: false, message: err.message})
    }
}

//Email Verification
export const verifyEmail = async(req,res)=>{
    const {userId, otp} = req.body;
      
    if(!userId || !otp){
        return res.json({success: false, message: "Missing Details"})
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.verifyOtpExpiredAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;

        await user.save();
        return res.json({success: true, message: "Logged In Successfully"});

    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

//Forgot Password OTP
export const sendResetOtp = async(req,res)=>{
    const {emailId} = req.body;
    if(!emailId){
        return res.json({success: false, message: "Email is Required"})
    }
    try{
    const user = await userModel.findOne({emailId});
    if(!user){
        return res.json({success: false, message: 'Invalid Credentials'})
    }
    const otp = String(Math.floor(100000 + Math.random()*900000));
    
    user.resetOtp = otp;
    user.resetOtpExpiredAt = Date.now()+ 15*60*1000;

    await user.save();

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.emailId,
        subject: '  Password Reset OTP',
        text: `Your OTP for resetting your password is ${otp}, Use this OTP within 15min to reset your password`,
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.emailId)
    }
    await transporter.sendMail(mailOptions);
    res.json({success: true, message: "OTP sent to your email"})

    }catch(err){
        res.json({success: false, message: err.message})
    }
}

//Reset User Password
export const resetPassword = async(req,res)=>{
    const {emailId, otp, newPassword} = req.body;
    
    if(!emailId || !otp || !newPassword){
        return res.json({success: false, message: "Missing Details"})
    }
    try{
        const user = await userModel.findOne({emailId});
        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success: false, message: "Invalid OTP"});
        }
        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({success: false, message: "OTP Expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();
        return res.json({success: true, message: "Password Reset Successful"});

    }catch(err){
        return res.json({success: false, message: err.message});
    }
}
