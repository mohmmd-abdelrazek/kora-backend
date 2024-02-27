import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController";
import { validateSignup } from "../middleware/middleware";

const router = express.Router();

// Sign up route
router.post("/signup", validateSignup, authController.signup);

// Login route
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    (err: unknown, user: Express.User, info: { message: unknown }) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "An error occurred during authentication.",
        });
      }
      if (!user) {
        // Send the message from the strategy to the frontend
        return res.status(401).json({ success: false, message: info.message });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res
            .status(500)
            .json({ success: false, message: "Failed to log in user." });
        }
        // Successfully authenticated
        return res
          .status(200)
          .json({ success: true, message: "Login successful", user });
      });
    }
  )(req, res, next);
});

// Logout route
router.get("/logout", authController.logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

router.get("/status", authController.status);

export default router;
