import { Router } from "express";
import iplayerService from "../service/iplayerService.js";
import historyService from "../service/historyService.js";

const router = Router();

router.get('/queue', (_, res) => {
    const queue = iplayerService.getQueue() || [];
    res.json(queue);
});

router.get('/history', async (_, res) => {
    const history = await historyService.getHistory() || [];
    res.json(history);
});

router.delete('/history', async (req, res) => {
    const {pid} = req.query;
    await historyService.removeHistory(pid);
    const history = await historyService.getHistory() || [];
    res.json(history);
})

router.delete('/queue', async (req, res) => {
    const {pid} = req.query;
   iplayerService.cancel(pid);
    const queue = iplayerService.getQueue() || [];
    res.json(queue);
})

export default router;