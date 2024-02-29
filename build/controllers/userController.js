"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = void 0;
const pgConfig_1 = __importDefault(require("../config/pgConfig")); // Database connection
// Get user profile
const getUserProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).send("User is not authenticated");
    }
    const userId = req.user.id;
    try {
        const user = await pgConfig_1.default.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
        if (user.rows.length > 0) {
            res.json(user.rows[0]);
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = async (req, res) => {
    const { name, email } = req.body; // Add other fields as necessary
    if (!req.user) {
        return res.status(401).send("User is not authenticated");
    }
    const userId = req.user.id;
    try {
        const updatedUser = await pgConfig_1.default.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, userId]);
        res.json(updatedUser.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error during profile update.");
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=userController.js.map