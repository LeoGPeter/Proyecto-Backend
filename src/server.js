import express from "express";
import productsRouter from "./routes/products.js";
import cartsRoutes from './routes/carts.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRoutes);

app.listen(PORT, ()=> {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});