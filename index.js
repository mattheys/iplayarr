import express from 'express';
import { getParameter } from './service/configService.js';
import { directory } from './endpoints/endpointDirectory.js';
import sonarrService from './service/sonarrService.js';
import iplayerService from './service/iplayerService.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
})

app.use('/api', (req, res) => {
    const {apikey : queryKey, mode} = req.query;
    const envKey = getParameter('API_KEY');
    if (envKey === queryKey){
        if (Object.keys(directory).includes(mode)){
            directory[mode](req, res);
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

app.get("/missing", async (_, res) => {
    const missing = await sonarrService.getMissing();
    res.json(missing);
});

app.get("/download", async (req, res) => {
    const {series, title, season, episode} = req.query;
    const allResults = await iplayerService.search(series);

    const result = allResults.find(({show}) => {
        const correctSeason = show.includes(`Series ${season}`);
        const correctEpisodeNumber = show.includes(`Episode ${episode}`);
        const correctEpisodeName = show.includes(title);
        return correctSeason && (correctEpisodeName || correctEpisodeNumber);
    });

    if (result){
        await iplayerService.download(result.id);
        res.json({"status" : "success"})
    } else {
        res.status(404).json({ "error": "Not found" });
    }
})

app.all('*', (req, res) => {
    console.log('Request received:');
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        res.status(404).json({ "error": "Not found" });
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
