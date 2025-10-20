import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

export interface AccessTokenPayload {
  userId: string;
  workspaceId?: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (userId: string, workspaceId?: string): string => {
  const payload: AccessTokenPayload = {
    userId,
    workspaceId,
  };

  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: string): string => {
  const payload: RefreshTokenPayload = {
    userId,
  };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
