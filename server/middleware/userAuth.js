import jwt from "jsonwebtoken";

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
        req.body.userId = tokenDecode.id;
        next();
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}


export default userAuth;
