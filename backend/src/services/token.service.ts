import mongoose from "mongoose";
import { generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { NotFoundException, UnauthorizedException } from "../utils/appError";

// Refresh Token Model Schema
const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for automatic cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = mongoose.model("RefreshToken", refreshTokenSchema);

export const storeRefreshToken = async (userId: string, token: string): Promise<void> => {
  try {
    // Decode token to get expiration
    const decoded = verifyRefreshToken(token);
    const expiresAt = new Date(decoded.exp! * 1000);

    const refreshToken = new RefreshTokenModel({
      userId: new mongoose.Types.ObjectId(userId),
      token,
      expiresAt,
    });

    await refreshToken.save();
  } catch (error) {
    throw new Error("Failed to store refresh token");
  }
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  try {
    await RefreshTokenModel.findOneAndDelete({ token });
  } catch (error) {
    throw new Error("Failed to revoke refresh token");
  }
};

export const revokeAllUserTokens = async (userId: string): Promise<void> => {
  try {
    await RefreshTokenModel.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
  } catch (error) {
    throw new Error("Failed to revoke all user tokens");
  }
};

export const isRefreshTokenValid = async (token: string): Promise<boolean> => {
  try {
    const refreshToken = await RefreshTokenModel.findOne({ token });
    return !!refreshToken;
  } catch (error) {
    return false;
  }
};

export const generateAndStoreRefreshToken = async (userId: string): Promise<string> => {
  try {
    const refreshToken = generateRefreshToken(userId);
    await storeRefreshToken(userId, refreshToken);
    return refreshToken;
  } catch (error) {
    throw new Error("Failed to generate and store refresh token");
  }
};

export const cleanupExpiredTokens = async (): Promise<void> => {
  try {
    await RefreshTokenModel.deleteMany({ expiresAt: { $lt: new Date() } });
  } catch (error) {
    console.error("Failed to cleanup expired tokens:", error);
  }
};

export default RefreshTokenModel;
