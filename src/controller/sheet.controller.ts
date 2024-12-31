import { Request, Response } from "express";
import { prisma } from "@repo/prisma/client";

export const createSheet = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    res.status(404).json({
      msg: "User not found ",
    });
    return;
  }
  const { title, slug } = req.body;

  if (!slug || !title) {
    res.status(400).json({
      error: "You have not enter valid inputs",
    });
    return;
  }
  try {
    const sheet = await prisma.sheet.create({
      data: {
        title,
        slug,
        userId,
      },
    });
    res.status(200).json({
      msg: "Sheet has been created",
      sheet,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Something wrong with Sheet Server",
    });
    return;
  }
};

export const deleteSheet = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({
      error: "user not found",
    });
    return;
  }
  const { slug } = req.params;
  try {
    const sheet = await prisma.sheet.findFirst({
      where: {
        slug,
        userId,
      },
    });
    if (!sheet) throw new Error("404 , Sheet not found");
    const deleted = await prisma.sheet.delete({
      where: {
        id: sheet.id,
      },
    });
    res.status(200).json({
      deleted,
    });
  } catch (error) {
    if (error instanceof Error) throw error.message;
  }
};
