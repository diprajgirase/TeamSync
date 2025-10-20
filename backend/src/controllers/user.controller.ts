import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";
import { getUserIdFromRequest } from "../utils/request-helper";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserIdFromRequest(req);

    const { user } = await getCurrentUserService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetch successfully",
      user,
    });
  }
);
