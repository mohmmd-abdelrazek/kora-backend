import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import flash from "connect-flash";

// Import your modular route definitions
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import leagueRoutes from "./routes/leagueRoutes";
import teamRoutes from "./routes/teamRoutes";

// Passport configuration imports

// Database connection import
// Assuming it sets up a connection and does not export anything directly used here
import "./config/pgConfig";
import passport from "./config/passportConfig";
import playerRoutes from "./routes/playerRoutes";

// Initialize environment variables
dotenv.config();

const app = express();

// Basic security practices
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allows cookies to be sent
  })
); // Configure as needed for your environment

// Body parsing middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    }, // Use secure cookies in production
  })
);

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// Modular route setup
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("", leagueRoutes);
app.use("", teamRoutes);
app.use("/player", playerRoutes);

const data: Record<string, string[]> = {
  "1": ["", "", "", "", ""],
  "2": ["", "", "", "", ""],
  "3": ["", "", "", "", ""],
};

app.get("/retrieve/:sectionId", (req, res) => {
  try {
    const sectionId = req.params.sectionId;

    if (!sectionId) {
      res.status(400).json({ error: "Invalid sectionId" });
      return;
    }

    if (data[sectionId]) {
      res.status(200).json({ data: data[sectionId] });
    } else {
      res.status(404).json({ error: "Section not found" });
    }
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/submit", (req, res) => {
  try {
    const { sectionId, inputIndex, value } = req.body;

    if (!sectionId || !inputIndex) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    if (!data[sectionId]) {
      res.status(404).json({ error: "Section not found" });
      return;
    }

    data[sectionId][inputIndex] = value;

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing submission:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const users = [
  {
    id: 1,
    username: "mohamed",
    password: "asdasd",
  },
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (user && user.password === password) {
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "secret_key"
    );

    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Catch-all for unhandled routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handling middleware
app.use((err: unknown, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
