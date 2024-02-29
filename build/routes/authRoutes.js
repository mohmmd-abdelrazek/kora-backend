"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authController = __importStar(require("../controllers/authController"));
const middleware_1 = require("../middleware/middleware");
const router = express_1.default.Router();
// Sign up route
router.post("/signup", middleware_1.validateSignup, authController.signup);
// Login route
router.post("/login", (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
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
    })(req, res, next);
});
// Logout route
router.get("/logout", authController.logout);
// Google OAuth routes
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   authController.googleCallback
// );
router.get("/status", authController.status);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map