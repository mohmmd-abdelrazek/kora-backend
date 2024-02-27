import express from "express";
import * as userController from "../controllers/userController";
import { isAuthenticated } from "../middleware/middleware"; // Middleware to check if the user is authenticated

const router = express.Router();

// Get user profile
// Use isAuthenticated middleware to ensure only authenticated users can access their profile
router.get("/profile", isAuthenticated, userController.getUserProfile);

// Update user profile
// Again, ensure the user is authenticated before allowing profile updates
router.post(
  "/profile/update",
  isAuthenticated,
  userController.updateUserProfile
);

export default router;
