import express from "express";
import { createSheet, deleteSheet } from "../controller/sheet.controller";
const sheetRouter = express.Router();

sheetRouter.post("/create", createSheet);

sheetRouter.post("/delete", deleteSheet);

export default sheetRouter;
