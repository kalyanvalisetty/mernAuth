import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    emailId: {type:String, required: true, unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please Enter an Valid Email Address")
            }
        }
    },
    password: {type:String, required: true, trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please Enter a Strong Password')
            }
        }
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verifyOtp: {type:String, default: ''},
    verifyOtpExpiredAt: {type:Number, default: 0},
    isAccountVerified: {type:Boolean, default: false},
    resetOtp: {type:String, default: ''},
    resetOtpExpiredAt: {type:Number, default: 0},
},
{
timestamps: true
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;