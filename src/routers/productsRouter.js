import express from 'express';

import { index, show, rarest } from '../controllers/productsController.js';

const productRouter = express.Router();

productRouter.get ('/', index);
productRouter.get ('/rarest', rarest);
productRouter.get ('/:slug', show);

export default productRouter;