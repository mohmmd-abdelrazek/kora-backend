import pool from "../config/pgConfig";
import { Request, Response } from "express";

export const submitPlayer = async (req: Request, res: Response) => {
  const { teamId, playerIndex, name, position } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO players (team_id, player_index, name, position) VALUES ($1, $2, $3, $4) RETURNING *",
      [teamId, playerIndex, name, position]
    );

    res.status(201).json({
      message: "Player submitted successfully",
      player: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting player:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlayer = async (req: Request, res: Response) => {
  const { teamId, playerIndex } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM players WHERE team_id = $1 AND player_index = $2",
      [teamId, playerIndex]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Player not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching player:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePlayer = async (req: Request, res: Response) => {
  const { teamId, playerIndex } = req.params;
  const { name, position } = req.body;

  try {
    // Example SQL query - adjust according to your schema
    // Assuming 'id' can be derived from `teamId` and `playerIndex`
    const query = `
      UPDATE players
      SET name = $1, position = $2
      WHERE team_id = $3 AND player_index = $4
      RETURNING *;
    `;

    const values = [name, position, teamId, playerIndex];

    const { rows } = await pool.query(query, values);

    if (rows.length > 0) {
      res.json({ player: rows[0], message: 'Player updated successfully' });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Error updating player information' });
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  const { teamId, playerIndex } = req.params; // Assuming the URL parameter is named 'playerId'

  try {
    const deleteQuery = 'DELETE FROM players WHERE team_id = $1 AND player_index = $2 RETURNING *;';
    const { rows } = await pool.query(deleteQuery, [teamId, playerIndex]);

    if (rows.length > 0) {
      res.status(200).json({ message: 'Player deleted successfully', deletedPlayer: rows[0] });
    } else {
      res.status(404).json({ message: 'Player not found' });
    }
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ message: 'Failed to delete player' });
  }
};