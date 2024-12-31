import express from "express";
const authRouter = express.Router();

import { signin, signup } from "../controller/auth.controller";

authRouter.post("/signup", signup);

authRouter.post("/signin", signin);

export default authRouter;
