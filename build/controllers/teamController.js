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
exports.getTeamsByLeague = void 0;
const pgConfig_1 = __importDefault(require("../config/pgConfig"));
const getTeamsByLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leagueId } = req.params; // Assuming the route parameter is named `leagueId`
    try {
        const { rows } = yield pgConfig_1.default.query("SELECT * FROM teams WHERE league_id = $1", [leagueId]);
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
});
exports.getTeamsByLeague = getTeamsByLeague;
//# sourceMappingURL=teamController.js.map