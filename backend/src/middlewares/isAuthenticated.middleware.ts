import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("🔍 Authentication Debug:");
  console.log("- Session ID:", (req as any).sessionID);
  console.log("- Session:", req.session);
  console.log("- User:", req.user);
  console.log("- Cookies:", req.headers.cookie);
  
  if (!req.user || !req.user._id) {
    console.log("❌ Authentication failed: No user found");
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  
  console.log("✅ Authentication successful");
  next();
};

export default isAuthenticated;
