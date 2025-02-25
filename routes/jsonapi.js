import { Router } from "express";
import iplayerService from "../service/iplayerService.js";
import historyService from "../service/historyService.js";

const router = Router();

router.get('/queue', (_, res) => {
    const queue = iplayerService.getQueue() || [];
    res.json(queue);
});

router.get('/history', (_, res) => {
    const history = historyService.getHistory() || [];
    res.json(history);
});

export default router;