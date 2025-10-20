import { Request } from "express";
import { UnauthorizedException } from "./appError";

export const getUserIdFromRequest = (req: Request): string => {
  const userId = req.jwtUser?._id;
  if (!userId) {
    throw new UnauthorizedException("User not authenticated");
  }
  return userId;
};
