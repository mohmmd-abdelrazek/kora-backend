import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import cors from "cors";
// import helmet from "helmet";
// import flash from "connect-flash";

// Import your modular route definitions
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import leagueRoutes from "./routes/leagueRoutes";
import teamRoutes from "./routes/teamRoutes";
import playerRoutes from "./routes/playerRoutes";

// Passport configuration imports

// Database connection import
// Assuming it sets up a connection and does not export anything directly used here
import "./config/pgConfig";
import passport from "./config/passportConfig";
import { sessionMiddleware } from "./config/redisConfig";

// Initialize environment variables

const app = express();
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Basic security practices
// app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allows cookies to be sent
  })
); // Configure as needed for your environment

// Body parsing middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(flash());

// Session configuration
app.use(sessionMiddleware);

app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("User:", req.user);
  next();
});

// Modular route setup
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("", leagueRoutes);
app.use("", teamRoutes);
app.use("/player", playerRoutes);

// Catch-all for unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware
app.use((err: unknown, req: Request, res: Response) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
