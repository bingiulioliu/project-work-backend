import express from 'express';
import productRouter from './src/routers/productsRouter.js';
import categoriesRouter from './src/routers/categoriesRouter.js';
import cors from 'cors';
import ordersRouter from './src/routers/ordersRouter.js';

const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/products', productRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);

app.listen(port, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    } else {
        console.log(`Server is running on http://${host}:${port}`);
    }
});