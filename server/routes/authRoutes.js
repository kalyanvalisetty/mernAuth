import express from "express";
import { authenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router()

authRouter.post('/register', register); //working
authRouter.post('/login', login); //working
authRouter.post('/logout', logout); //working
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);//working
authRouter.post('/verify-account', userAuth, verifyEmail); //working
authRouter.get('/is-auth', userAuth, authenticated); //working
authRouter.post('/send-reset-otp', sendResetOtp); //working
authRouter.post('/reset-password', resetPassword); //working

export default authRouter