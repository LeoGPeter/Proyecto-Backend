import { Router } from 'express';
import MessageManager from '../dao/MessageManager.js';

export default function chatRouter(io) {
    const router = Router();

    router.get('/', async (req, res) => {
        const messages = await MessageManager.getMessages();
        res.render('chat', { messages });
    });

    router.post('/messages', async (req, res) => {
        const { user, message } = req.body;

        if (!user || !message) {
            return res.status(400).json({ error: 'Usuario y mensaje son requeridos' });
        }

        const newMessage = await MessageManager.addMessage({ user, message });
        io.emit('newMessage', newMessage);
        res.status(201).json(newMessage);
    });

    return router;
}
