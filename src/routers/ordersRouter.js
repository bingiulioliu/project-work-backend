import express from 'express';

import { index, show } from '../controllers/ordersController.js';

const ordersRouter = express.Router();

ordersRouter.get ('/', index);
ordersRouter.get ('/:order_number', show);

export default ordersRouter;