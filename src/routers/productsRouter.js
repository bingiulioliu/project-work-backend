import express from 'express';

import { index, show, rarest, create } from '../controllers/productsController.js';

const productRouter = express.Router();

productRouter.get ('/', index);
productRouter.get ('/rarest', rarest);
productRouter.get ('/:slug', show);
productRouter.post ('/', create);

export default productRouter;