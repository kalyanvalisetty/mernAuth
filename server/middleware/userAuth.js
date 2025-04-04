import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success: false, message: "Not Authorized - Please Login Again"})
    }
    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(!tokenDecode.id){
            return res.json({success: false, message: "Not Authorized - Please Login Again"})
        }
        const user = await userModel.findById(tokenDecode.id);
        req.user = user;
        next();
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }
    next();
  };

export default userAuth;
