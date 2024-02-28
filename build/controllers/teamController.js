"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamsByLeague = void 0;
const pgConfig_1 = __importDefault(require("../config/pgConfig"));
const getTeamsByLeague = async (req, res) => {
    const { leagueId } = req.params; // Assuming the route parameter is named `leagueId`
    try {
        const { rows } = await pgConfig_1.default.query("SELECT * FROM teams WHERE league_id = $1", [leagueId]);
        if (rows.length === 0) {
            return res
                .status(404)
                .json({ message: "No teams found for the specified league." });
        }
        res.json(rows);
    }
    catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getTeamsByLeague = getTeamsByLeague;
//# sourceMappingURL=teamController.js.map