import { CartModel } from '../models/cart.model.js';

export class CartManagerMongo {
  async getAll() {
    return await CartModel.find().populate('products.productId');
  }

  async getById(id) {
    return await CartModel.findById(id).populate('products.productId');
  }

  async create(cartData) {
    return await CartModel.create(cartData);
  }

  async update(id, cartData) {
    return await CartModel.findByIdAndUpdate(id, cartData, { new: true });
  }

  async delete(id) {
    return await CartModel.findByIdAndDelete(id);
  }
}
