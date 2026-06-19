import express from 'express';

import { index, show } from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.get ('/', index);
categoriesRouter.get ('/:slug', show);

export default categoriesRouter;