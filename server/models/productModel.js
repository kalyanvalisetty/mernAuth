import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {type:String, required: true},
    description : {type:String, required: true},
    imageUrl : {type:String, required: true},
    price: {type:Number, required: true}
},{
    timestamps: true
})

productSchema.virtual('review',{
    ref: 'review',
    localField: '_id',
    foreignField: 'productId'
})

productSchema.set('toObject', {virtuals: true})
productSchema.set('toJSON', {virtuals: true})

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;