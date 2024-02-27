import express from 'express';
import * as playerControllers from "../controllers/playerControllers"

const router = express.Router();

router.post('/submit', playerControllers.submitPlayer);
router.get('/:teamId/:playerIndex', playerControllers.getPlayer);
router.put('/:teamId/:playerIndex', playerControllers.updatePlayer);
router.delete('/:teamId/:playerIndex', playerControllers.deletePlayer);

export default router;
