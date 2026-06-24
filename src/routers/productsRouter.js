import express from 'express';
import { index, show, rarest, cheapest, create, modify, destroy, suggested } from '../controllers/productsController.js';

const productRouter = express.Router();

productRouter.get ('/', index);
productRouter.get ('/rarest', rarest);
productRouter.get('/cheapest', cheapest);
productRouter.get ('/:slug', show);
productRouter.post ('/', create);
productRouter.patch ('/:slug', modify);
productRouter.delete ('/:slug', destroy);
productRouter.get ('/:slug/suggested', suggested);

export default productRouter;