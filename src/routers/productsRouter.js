import express from 'express';

import { index, show, rarest, cheapest } from '../controllers/productsController.js';

const productRouter = express.Router();

productRouter.get ('/', index);
productRouter.get ('/rarest', rarest);
productRouter.get('/cheapest', cheapest);
productRouter.get ('/:slug', show);

export default productRouter;