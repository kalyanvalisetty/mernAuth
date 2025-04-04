import express from "express";
import userAuth, { adminAuth } from "../middleware/userAuth.js";
import { getAllProducts, postProduct } from "../controllers/adminController.js";

const adminRouter = express.Router()

adminRouter.get('/products', userAuth, adminAuth, getAllProducts); //working
adminRouter.post('/post-product', userAuth, adminAuth, postProduct); //working

export default adminRouter


