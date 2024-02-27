import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import pool from "../config/pgConfig"; // Assuming your database pool export

// User signup
export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    // Check for existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
    );

    // Insert new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const { id, name: userName, email: userEmail } = newUser.rows[0];
    res.status(201).json({
      message: "Signup successful",
      user: { id, name: userName, email: userEmail },
    });
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique violation
      return res.status(400).json({ error: "Email already in use." });
    }
    console.error(error);
    res.status(500).json({ error: "Server error during signup." });
  }
};

// User login - handled by Passport's local strategy; this is just for demonstration
export const login = (req: Request, res: Response) => {
  // Authentication is actually handled by Passport before this function is called
  if (req.user) {
    res.status(200).json({ message: "Login successful", user: req.user });
  } else {
    res.status(401).json({ error: "Login failed" });
  }
};

// User logout
export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.status(200).json({ success: true, message: "Logout successful" });
  });
};

// Google auth callback
export const googleCallback = passport.authenticate("google");

export const status = (req: Request, res: Response) => {
  res.status(200).json({ isAuthenticated: req.isAuthenticated(), user: req.user });
};
