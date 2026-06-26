import express from "express";
import { assistant, assistantPresetQuestions } from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.get("/assistant/preset-questions", assistantPresetQuestions);
aiRouter.post("/assistant", assistant);

export default aiRouter;