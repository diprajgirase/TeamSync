import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../utils/appError";
import { UserDocument } from "../models/user.model";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided or invalid token format');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    
    // 3. Add user to request object
    // For now, we're just adding the userId to the request
    // In a real application, you would fetch the user from the database here
    req.user = { _id: decoded.userId } as UserDocument;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedException('Invalid token'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException('Token expired'));
    }
    next(error);
  }
};

export default isAuthenticated;
