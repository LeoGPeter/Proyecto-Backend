import { MessageModel } from '../models/message.model.js';

export class MessageManagerMongo {
  async getAll() {
    return await MessageModel.find();
  }

  async create(messageData) {
    return await MessageModel.create(messageData);
  }
}
