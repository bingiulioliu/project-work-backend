import express from 'express';

import { index, show, rarest, create, modify, destroy } from '../controllers/productsController.js';

const productRouter = express.Router();

productRouter.get ('/', index);
productRouter.get ('/rarest', rarest);
productRouter.get ('/:slug', show);
productRouter.post ('/', create);
productRouter.patch ('/:slug', modify);
productRouter.delete ('/:slug', destroy);

export default productRouter;