import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    category: { type: String, required: true }
},
    {
        timestamps: true
    });

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model('Product', productSchema);
export default ProductModel;
