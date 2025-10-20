import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
  refreshTokenController,
} from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);
authRoutes.post("/refresh", refreshTokenController);

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false, // Disable session for JWT
  })
);

authRoutes.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback route hit");
    console.log("Query params:", req.query);
    next();
  },
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: false, // Disable session for JWT
  }),
  googleLoginCallback
);

export default authRoutes;
