import userModel from "../models/userModel.js";

export const getUserData = async(req,res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User Not Found"});
        }
        return res.json({success: true, userData: {
            name: user.userName,
            isAccountVerified: user.isAccountVerified
        }});
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}