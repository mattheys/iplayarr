import { Router } from "express";
import iplayerService from "../service/iplayerService.js";

const router = Router();

router.get('/queue', (_, res) => {
    const queue = iplayerService.getQueue() || [];
    res.json(queue);
});

router.get('/history', (_, res) => {
    const history = iplayerService.getHistory() || [];
    res.json(history);
});

export default router;