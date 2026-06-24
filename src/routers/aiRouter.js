import express from "express";
import { assistant } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post("/assistant", assistant);

export default aiRouter;