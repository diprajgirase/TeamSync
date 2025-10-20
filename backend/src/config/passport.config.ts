import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";
import { loginOrCreateAccountService } from "../services/auth.service";

// Google OAuth Strategy (only for OAuth flow)
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        console.log("=== PASSPORT STRATEGY CALLED ===");
        console.log("Access Token:", accessToken ? "Present" : "Missing");
        console.log("Profile:", profile);
        
        const { email, sub: googleId, picture } = profile._json;
        console.log("Extracted - Email:", email, "GoogleId:", googleId, "Picture:", picture);
        
        if (!googleId) {
          console.log("ERROR: Google ID (sub) is missing");
          throw new NotFoundException("Google ID (sub) is missing");
        }

        console.log("Calling loginOrCreateAccountService...");
        const { user } = await loginOrCreateAccountService({
          provider: ProviderEnum.GOOGLE,
          displayName: profile.displayName,
          providerId: googleId,
          picture: picture,
          email: email,
        });
        
        console.log("User created/found:", user._id);
        console.log("=== PASSPORT STRATEGY SUCCESS ===");
        done(null, user as any);
      } catch (error) {
        console.log("=== PASSPORT STRATEGY ERROR ===");
        console.log("Error:", error);
        done(error, false);
      }
    }
  )
);

// Remove Local Strategy and session serialization for JWT
// Local authentication is now handled directly in controllers
