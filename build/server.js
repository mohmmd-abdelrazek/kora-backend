"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const connect_flash_1 = __importDefault(require("connect-flash"));
// Import your modular route definitions
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const leagueRoutes_1 = __importDefault(require("./routes/leagueRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
// Passport configuration imports
// Database connection import
// Assuming it sets up a connection and does not export anything directly used here
require("./config/pgConfig");
const passportConfig_1 = __importDefault(require("./config/passportConfig"));
const playerRoutes_1 = __importDefault(require("./routes/playerRoutes"));
// Initialize environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
// Basic security practices
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allows cookies to be sent
})); // Configure as needed for your environment
// Body parsing middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, connect_flash_1.default)());
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
    }, // Use secure cookies in production
}));
// Initialize Passport for authentication
app.use(passportConfig_1.default.initialize());
app.use(passportConfig_1.default.session());
app.use((req, res, next) => {
    console.log(req.session);
    console.log(req.user);
    next();
});
// Modular route setup
app.use("/auth", authRoutes_1.default);
app.use("/user", userRoutes_1.default);
app.use("", leagueRoutes_1.default);
app.use("", teamRoutes_1.default);
app.use("/player", playerRoutes_1.default);
// Catch-all for unhandled routes
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
// Error handling middleware
app.use((err, req, res) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
});
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map