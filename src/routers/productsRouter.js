import express from 'express';

import { index, show } from '../controllers/productsController.js';

const productRouter = express.Router();

productRouter.get ('/', index);
productRouter.get ('/:slug', show);

export default productRouter;