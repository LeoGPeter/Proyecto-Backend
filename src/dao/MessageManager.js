import Message from './models/message.model.js';

class MessageManager {
    async getMessages() {
        return await Message.find().lean();
    }

    async addMessage(data) {
        return await Message.create(data);
    }
}

export default new MessageManager();
