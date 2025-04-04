import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";


export const getUserData = async(req,res)=>{
    try{
        const user = req.user;
        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }
        return res.json({success: true, userData: {
            name: user.userName,
            isAccountVerified: user.isAccountVerified,
            role: user.role
        }});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export const getProducts = async(req,res)=>{
    try{
        const allProducts = await productModel.find({}).populate({
            path: 'review',
            match: { fromUserId: req.user._id },
            select: "rating comment"
          });        
    return res.json({success: true, message: "Products fetched", allProducts});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}


export const postReview = async(req,res)=>{
    try{
        const {productId, rating, comment} = req.body;
        if(!productId || !rating){
            return res.json({success: false, message: "Missing Mandatory Details!"});
        }
        const user = req.user;
        const review = new reviewModel({productId, fromUserId: user._id, rating, comment});
        await review.save()        
        return res.json({success: true, message: "Review Added"});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

