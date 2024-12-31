import { Request, Response } from "express";
import { prisma } from "@repo/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "Cutiemiddelware";

export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      error: "You have not enter inputs",
    });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) {
      res.json({
        error: "user not found",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, username: username }, secretKey);
    res.json({ token: `Bearer ${token}` });
    return;
  } catch {
    res.status(500).json({ error: "Failed to login" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { password, username } = req.body;

  if (!password || !username) {
    res.status(400).json({
      msg: "user doesn't exist",
    });
    return;
  }
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!findUser) {
      res.status(400).json({
        msg: "User already exist",
      });
      return;
    }

    if (typeof password !== "string" || password.length < 1) {
      res.status(400).json({ error: "Invalid password" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ id: user.id, role: user.role }, secretKey);

    res.status(200).json({
      msg: `Your account has been created`,
      username,
      token: `Bearer ${token}`,
    });
    return;
  } catch (err) {
    console.error(err);
  }
};
