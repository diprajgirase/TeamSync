import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { UnauthorizedException } from "../utils/appError";
import UserModel from "../models/user.model";

// Define a custom user interface for JWT auth
interface JWTUser {
  _id: string;
  email: string;
  name: string;
  profilePicture?: string | null;
  currentWorkspace?: string;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      jwtUser?: JWTUser;
    }
  }
}

const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    // Verify access token
    const decoded = verifyAccessToken(token);

    // Get user from database
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Attach user to request object
    req.jwtUser = {
      _id: String(user._id),
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      currentWorkspace: user.currentWorkspace?.toString(),
    };

    next();
  } catch (error) {
    next(new UnauthorizedException("Invalid or expired token"));
  }
};

export default jwtAuth;
