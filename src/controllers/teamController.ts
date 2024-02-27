import { Request, Response } from "express";
import pool from "../config/pgConfig";

export const getTeamsByLeague = async (req: Request, res: Response) => {
  const { leagueId } = req.params; // Assuming the route parameter is named `leagueId`

  try {
    const { rows } = await pool.query(
      "SELECT * FROM teams WHERE league_id = $1",
      [leagueId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No teams found for the specified league." });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
