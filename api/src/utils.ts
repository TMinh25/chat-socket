import mongoose from "mongoose";
import { Request } from "express";

export function isValidObjectID(_id: string | mongoose.ObjectId): boolean {
  return mongoose.Types.ObjectId.isValid(_id.toString());
}

/** Lấy Token trong header Authorization */
export const getAuthorizationHeaderToken = (req: Request): string => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.split(" ")[0] === "Bearer") {
    return authHeader.split(" ")[1];
  }
  return "";
};
