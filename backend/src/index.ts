import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import jwtAuth from "./middlewares/jwtAuth.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport (for Google OAuth only)
app.use(passport.initialize());

// CORS configuration for JWT
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: false, // No longer needed for JWT
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, jwtAuth, userRoutes);
app.use(`${BASE_PATH}/workspace`, jwtAuth, workspaceRoutes);
app.use(`${BASE_PATH}/member`, jwtAuth, memberRoutes);
app.use(`${BASE_PATH}/project`, jwtAuth, projectRoutes);
app.use(`${BASE_PATH}/task`, jwtAuth, taskRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
