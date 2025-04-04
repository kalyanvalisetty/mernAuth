import express from "express";
import { getProducts, getUserData, postReview } from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router()

userRouter.get('/data', userAuth, getUserData); //working
userRouter.get('/products', userAuth, getProducts); //working
userRouter.post('/post-review', userAuth, postReview); //working

export default userRouter;