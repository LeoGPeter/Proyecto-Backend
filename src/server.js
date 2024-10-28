import express from "express";
import productsRouter from "./routes/products.js";
import cartsRoutes from './routes/carts.js';
import { engine } from "express-handlebars";
import { createServer } from 'http';
import { Server } from 'socket.io';
import viewsRouter from './routes/viewsRouter.js';
import fs from 'fs/promises';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.engine("handlebars", engine())
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRoutes);
app.use('/', viewsRouter);

// Función para obtener la lista de productos
async function getProducts() {
    const data = await fs.readFile('./src/data/productos.json', 'utf-8');
    return JSON.parse(data);
}

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

// Emitir lista completa después de crear un producto
app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    // Añade lógica para guardar el producto en productos.json

    const updatedProducts = await getProducts();
    io.emit('updateProducts', updatedProducts); // Emitir lista completa actualizada
    res.status(201).send(newProduct);
});

// Emitir lista completa después de eliminar un producto
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    // Añade lógica para eliminar el producto de productos.json

    const updatedProducts = await getProducts();
    io.emit('updateProducts', updatedProducts); // Emitir lista completa actualizada
    res.status(200).send({ message: `Producto ${id} eliminado` });
});

server.listen(8080, () => console.log('Servidor en puerto 8080'));
