import express from 'express';
import { getParameter } from './service/configService.js';
import { directory } from './endpoints/endpointDirectory.js';
import multer from 'multer';
import cron from 'node-cron';
import iplayerService from './service/iplayerService.js';


const app = express();
const port = 4404;
const cronSchedule = getParameter("REFRESH_SCHEDULE") || "0 * * * *";

const upload = multer();
app.use(express.json());

app.use('/api', upload.any(), (req, res) => {
    const {apikey : queryKey, mode, t} = req.query;
    const envKey = getParameter('API_KEY');
    if (envKey === queryKey){
        const endpoint = mode ?? t;
        if (Object.keys(directory).includes(endpoint)){
            directory[endpoint](req, res);
        } else {
            console.log('Request received:');
            console.log('Method:', req.method);
            console.log('URL:', req.url);
            console.log('Headers:', req.headers);
            console.log('Body:', req.body);
            res.status(404).json({ "error": "Not found" });
        }
    } else {
        res.status(401).json({ "error": "Not authorised" });
    }
});

cron.schedule(cronSchedule, () => {
  iplayerService.refreshCache();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
