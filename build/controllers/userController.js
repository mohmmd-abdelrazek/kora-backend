"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserProfile = void 0;
const pgConfig_1 = __importDefault(require("../config/pgConfig")); // Database connection
// Get user profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res.status(401).send("User is not authenticated");
    }
    const userId = req.user.id;
    try {
        const user = yield pgConfig_1.default.query("SELECT id, name, email FROM users WHERE id = $1", [userId]);
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
});
exports.getUserProfile = getUserProfile;
// Update user profile
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body; // Add other fields as necessary
    if (!req.user) {
        return res.status(401).send("User is not authenticated");
    }
    const userId = req.user.id;
    try {
        const updatedUser = yield pgConfig_1.default.query("UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *", [name, email, userId]);
        res.json(updatedUser.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error during profile update.");
    }
});
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=userController.js.map