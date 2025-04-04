import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type:mongoose.Types.ObjectId, 
        required: true,
        ref: 'product'
    },
    fromUserId: {
        type:mongoose.Types.ObjectId, 
        required: true,
        ref: 'user'
    },
    rating: {type: Number, required: true},
    comment: {type:String, required: true}
},{
    timestamps: true
})

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);

export default reviewModel;