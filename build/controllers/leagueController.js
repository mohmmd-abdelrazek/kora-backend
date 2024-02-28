"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSchedule = exports.getLeagues = exports.getLeague = exports.createLeague = void 0;
const pgConfig_1 = __importDefault(require("../config/pgConfig"));
const createLeague = async (req, res) => {
    var _a;
    const { leagueName, numberOfTeams, playersPerTeam, date, startTime, matchDuration, breakDuration, totalPlayTime, numberOfPlaygrounds, teamNames, } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        // Begin transaction
        await pgConfig_1.default.query("BEGIN");
        // Insert the league into the leagues table
        const leagueInsertQuery = "INSERT INTO leagues(name, number_of_teams, players_per_team, date, start_time, match_duration, break_duration, total_time, number_of_grounds, user_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
        const leagueValues = [
            leagueName,
            numberOfTeams,
            playersPerTeam,
            date,
            startTime,
            matchDuration,
            breakDuration,
            totalPlayTime,
            numberOfPlaygrounds,
            userId,
        ];
        const leagueResult = await pgConfig_1.default.query(leagueInsertQuery, leagueValues);
        const league = leagueResult.rows[0];
        const leagueId = league.id;
        // Insert each team into the teams table
        const teamInsertQuery = "INSERT INTO teams(name, league_id) VALUES($1, $2)";
        for (const teamName of teamNames) {
            await pgConfig_1.default.query(teamInsertQuery, [teamName, leagueId]);
        }
        // Commit transaction
        await pgConfig_1.default.query("COMMIT");
        res.status(201).json({
            message: "League and teams created successfully",
            league: league,
        });
    }
    catch (error) {
        // Rollback in case of error
        await pgConfig_1.default.query("ROLLBACK");
        console.error("Failed to create league and teams:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createLeague = createLeague;
const getLeague = async (req, res) => {
    const { leagueId } = req.params;
    try {
        const { rows } = await pgConfig_1.default.query("SELECT * FROM leagues WHERE id = $1", [
            leagueId,
        ]);
        if (rows.length > 0) {
            res.json(rows[0]);
        }
        else {
            res.status(404).json({
                message: "League not found or you do not have permission to view it.",
            });
        }
    }
    catch (error) {
        console.error("Error fetching league:", error);
        res.status(500).json({ message: "Server error while fetching league." });
    }
};
exports.getLeague = getLeague;
const getLeagues = async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const { rows } = await pgConfig_1.default.query("SELECT * FROM leagues WHERE user_id = $1", [userId]);
        if (rows.length > 0) {
            res.json(rows);
        }
        else {
            res.status(404).json({
                message: "Leagues not found or you do not have permission to view it.",
            });
        }
    }
    catch (error) {
        console.error("Error fetching leagues:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getLeagues = getLeagues;
const generateSchedule = async (req, res) => {
    const { leagueId } = req.params;
    try {
        const leagueQuery = "SELECT * FROM leagues WHERE id = $1";
        const leagueRes = await pgConfig_1.default.query(leagueQuery, [leagueId]);
        const league = leagueRes.rows[0];
        if (!league) {
            return res.status(404).json({ message: "League not found" });
        }
        const { total_time: totalTime, number_of_grounds: numberOfPlaygrounds, match_duration: matchDuration, break_duration: breakDuration, date, start_time: startTime, } = league;
        const totalPlayTimeMs = totalTime * 60000;
        const matchTotalDurationMs = (matchDuration + breakDuration) * 60000;
        const dateWithoutTime = date.toISOString().split('T')[0];
        const startDateTime = new Date(`${dateWithoutTime}T${startTime}`);
        let currentTime = startDateTime;
        const endTime = new Date(currentTime.getTime() + totalPlayTimeMs);
        const teamsQuery = "SELECT * FROM teams WHERE league_id = $1 ORDER BY team_id";
        const teamsRes = await pgConfig_1.default.query(teamsQuery, [leagueId]);
        let teams = teamsRes.rows;
        if (teams.length % 2 !== 0) {
            teams.push({ team_id: "bye", name: "Bye" }); // Dummy team for bye matches
        }
        const schedule = [];
        let round = 1;
        // const rounds = teams.length - 1; // Total rounds in a single round-robin
        for (let currentRound = 0;; currentRound++) {
            for (let match = 0; match < teams.length / 2; match++) {
                if (currentTime.getTime() + matchTotalDurationMs > endTime.getTime())
                    break;
                // Calculate match pairings
                const homeTeam = teams[match];
                const awayTeam = teams[teams.length - 1 - match];
                if (homeTeam.team_id === "bye" || awayTeam.team_id === "bye")
                    continue; // Skip "bye" matches
                const playgroundIndex = match % numberOfPlaygrounds;
                const playgroundName = `Playground ${playgroundIndex + 1}`;
                schedule.push({
                    round,
                    homeTeam: homeTeam.name,
                    awayTeam: awayTeam.name,
                    playground: playgroundName,
                    startTime: new Date(currentTime).toLocaleString(),
                    endTime: new Date(currentTime.getTime() + matchDuration * 60000).toLocaleString(),
                    type: "Match",
                });
                currentTime = new Date(currentTime.getTime() + matchTotalDurationMs);
            }
            // Rotate teams for the next round, keeping the first team fixed
            teams = [teams[0], ...teams.slice(-1), ...teams.slice(1, -1)];
            round++;
            if (currentTime.getTime() + matchTotalDurationMs > endTime.getTime())
                break;
        }
        res.json(schedule);
    }
    catch (error) {
        console.error("Error generating schedule:", error);
        res.status(500).json({ message: "Failed to generate schedule" });
    }
};
exports.generateSchedule = generateSchedule;
//# sourceMappingURL=leagueController.js.map