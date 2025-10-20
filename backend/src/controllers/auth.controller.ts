import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema, loginSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { 
  registerUserService, 
  verifyUserService, 
  loginOrCreateAccountService,
  refreshTokenService,
  logoutService
} from "../services/auth.service";
import passport from "passport";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as any;
    
    if (!user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Google authentication failed",
      });
    }

    try {
      // Import JWT utilities
      const { generateAccessToken, generateRefreshToken } = await import("../utils/jwt");
      
      console.log("User object:", user);
      console.log("User ID:", user._id);
      
      // Generate JWT tokens for the authenticated user
      const accessToken = generateAccessToken(String(user._id), user.currentWorkspace?.toString());
      console.log("Access token generated successfully");
      
      // Generate refresh token without storing it for now (to test)
      const refreshToken = generateRefreshToken(String(user._id));
      console.log("Refresh token generated successfully");

      // Redirect to frontend with tokens
      const redirectUrl = `${config.FRONTEND_ORIGIN}/google/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      console.log("Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error("Error in Google OAuth callback:", error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Failed to generate authentication tokens",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const result = await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse({
      ...req.body,
    });

    const result = await verifyUserService({
      email: body.email,
      password: body.password,
    });

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged in successfully",
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken) {
      await logoutService(refreshToken);
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  }
);

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Refresh token is required",
      });
    }

    const result = await refreshTokenService(refreshToken);

    return res.status(HTTPSTATUS.OK).json({
      message: "Tokens refreshed successfully",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  }
);
