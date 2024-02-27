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
exports.status = exports.googleCallback = exports.logout = exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const pgConfig_1 = __importDefault(require("../config/pgConfig")); // Assuming your database pool export
// User signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        // Check for existing user
        const existingUser = yield pgConfig_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use." });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
        // Insert new user into the database
        const newUser = yield pgConfig_1.default.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email", [name, email, hashedPassword]);
        const { id, name: userName, email: userEmail } = newUser.rows[0];
        res.status(201).json({
            message: "Signup successful",
            user: { id, name: userName, email: userEmail },
        });
    }
    catch (error) {
        if (error.code === "23505") {
            // PostgreSQL unique violation
            return res.status(400).json({ error: "Email already in use." });
        }
        console.error(error);
        res.status(500).json({ error: "Server error during signup." });
    }
});
exports.signup = signup;
// User login - handled by Passport's local strategy; this is just for demonstration
const login = (req, res) => {
    // Authentication is actually handled by Passport before this function is called
    if (req.user) {
        res.status(200).json({ message: "Login successful", user: req.user });
    }
    else {
        res.status(401).json({ error: "Login failed" });
    }
};
exports.login = login;
// User logout
const logout = (req, res) => {
    req.logout(() => {
        res.status(200).json({ success: true, message: "Logout successful" });
    });
};
exports.logout = logout;
// Google auth callback
exports.googleCallback = passport_1.default.authenticate("google");
const status = (req, res) => {
    res.status(200).json({ isAuthenticated: req.isAuthenticated(), user: req.user });
};
exports.status = status;
//# sourceMappingURL=authController.js.map