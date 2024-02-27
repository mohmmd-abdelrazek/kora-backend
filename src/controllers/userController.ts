import { Request, Response } from "express";
import pool from "../config/pgConfig"; // Database connection

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  const userId = req.user.id;
  try {
    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [userId]
    );
    if (user.rows.length > 0) {
      res.json(user.rows[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const { name, email } = req.body; // Add other fields as necessary
  if (!req.user) {
    return res.status(401).send("User is not authenticated");
  }
  const userId = req.user.id;

  try {
    const updatedUser = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, userId]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error during profile update.");
  }
};
