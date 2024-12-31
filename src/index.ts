import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes";
import sheetRouter from "./routes/sheet.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({
    health: Date.now(),
    msg: "Server is running now ",
  });
});

app.use("/auth", authRouter);
app.use("/sheet", sheetRouter);

app.listen(3212, () => {
  console.log(`Server is runnning on port 3212`);
});
