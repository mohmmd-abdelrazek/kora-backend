"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlayer = exports.updatePlayer = exports.getPlayer = exports.submitPlayer = void 0;
const pgConfig_1 = __importDefault(require("../config/pgConfig"));
const submitPlayer = async (req, res) => {
    const { teamId, playerIndex, name, position } = req.body;
    try {
        const result = await pgConfig_1.default.query("INSERT INTO players (team_id, player_index, name, position) VALUES ($1, $2, $3, $4) RETURNING *", [teamId, playerIndex, name, position]);
        res.status(201).json({
            message: "Player submitted successfully",
            player: result.rows[0],
        });
    }
    catch (error) {
        console.error("Error submitting player:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.submitPlayer = submitPlayer;
const getPlayer = async (req, res) => {
    const { teamId, playerIndex } = req.params;
    try {
        const result = await pgConfig_1.default.query("SELECT * FROM players WHERE team_id = $1 AND player_index = $2", [teamId, playerIndex]);
        if (result.rows.length === 0) {
            return res.json({ message: "Player not found" });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error fetching player:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getPlayer = getPlayer;
const updatePlayer = async (req, res) => {
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
        const { rows } = await pgConfig_1.default.query(query, values);
        if (rows.length > 0) {
            res.json({ player: rows[0], message: 'Player updated successfully' });
        }
        else {
            res.status(404).json({ message: 'Player not found' });
        }
    }
    catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ message: 'Error updating player information' });
    }
};
exports.updatePlayer = updatePlayer;
const deletePlayer = async (req, res) => {
    const { teamId, playerIndex } = req.params; // Assuming the URL parameter is named 'playerId'
    try {
        const deleteQuery = 'DELETE FROM players WHERE team_id = $1 AND player_index = $2 RETURNING *;';
        const { rows } = await pgConfig_1.default.query(deleteQuery, [teamId, playerIndex]);
        if (rows.length > 0) {
            res.status(200).json({ message: 'Player deleted successfully', deletedPlayer: rows[0] });
        }
        else {
            res.status(404).json({ message: 'Player not found' });
        }
    }
    catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ message: 'Failed to delete player' });
    }
};
exports.deletePlayer = deletePlayer;
//# sourceMappingURL=playerControllers.js.map