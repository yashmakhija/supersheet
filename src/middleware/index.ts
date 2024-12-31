import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(409).json({
        success: false,
        message: "No user found",
      });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "Cutiemiddelware"
    ) as {
      id: number;
    };

    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Not autorized - invalid token",
      });
      return;
    }

    req.userId = decoded.id;
    console.log("User found", decoded);

    next();
  } catch (error) {
    console.log("Error while getting user details");
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token",
      });
      return;
    } else {
      res.status(500).json({
        success: false,
        message: "Error in server",
      });
      return;
    }
  }
};
