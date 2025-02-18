import express from 'express';
import { getParameter } from './service/configService.js';
import { directory } from './endpoints/endpointDirectory.js';
const app = express();
const port = 4044;

app.use(express.json());

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
