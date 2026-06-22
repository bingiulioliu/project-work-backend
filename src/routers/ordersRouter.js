import express from 'express';

import { index, show, create, modify, remove } from '../controllers/ordersController.js';

const ordersRouter = express.Router();

ordersRouter.get ('/', index);
ordersRouter.get ('/:order_number', show);
ordersRouter.post('/', create);
ordersRouter.put('/:order_number', modify);
ordersRouter.delete('/:order_number', remove);

export default ordersRouter;