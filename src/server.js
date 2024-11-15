import express from "express";
import productsRouter from "./routes/products.js";
import cartsRoutes from './routes/carts.js';
import { engine } from "express-handlebars";
import { createServer } from 'http';
import { Server } from 'socket.io';
import viewsRouter from './routes/viewsRouter.js';
import * as path from "path";
import __dirname from "./utils.js";
import { connectMongo } from "./config/mongo.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.engine("handlebars", engine());
app.set('view engine', 'handlebars');
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));
app.use('/', viewsRouter);

app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRoutes);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

server.listen(8080, () => console.log('Servidor en puerto 8080'));

connectMongo();

