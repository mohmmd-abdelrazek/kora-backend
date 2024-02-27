import express from "express";
import * as teamController from "../controllers/teamController";

const router = express.Router();

router.get("/teams/:leagueId", teamController.getTeamsByLeague);

export default router;
