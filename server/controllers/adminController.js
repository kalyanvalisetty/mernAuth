import productModel from "../models/productModel.js";

export const getAllProducts = async(req,res)=>{
    try{
        const allProducts = await productModel.find({}).populate({
            path: 'review',
            select: "rating comment fromUserId",
            populate: { 
              path: 'fromUserId', 
              select: 'userName' 
            }
          });
        return res.json({success: true, message: "Products fetched", allProducts});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export const postProduct = async(req,res)=>{
    try{
        const {title,description,imageUrl,price} = req.body;
        if(!title || !description || !price){
            return res.json({success: false, message: "Missing Mandatory Details!"});
        }
        const product = new productModel({title,description,imageUrl,price});
        await product.save()        
        return res.json({success: true, message: "Product Added"});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}
