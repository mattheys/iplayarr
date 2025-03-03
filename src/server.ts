import express, {Express, NextFunction, Request, Response} from 'express';
import loggingService from './service/loggingService';
import http, { Server } from 'http';
import { Server as SocketIOServer } from "socket.io";
import { IplayarrParameter } from './types/IplayarrParameters';
import ApiRoute from './routes/ApiRoute';
import JsonApiRoute from './routes/JsonApiRoute';
import path from 'path';
import socketService from './service/socketService';

const app : Express = express();
const port : number = parseInt(process.env[IplayarrParameter.PORT.toString()] || "4404");

app.use(express.static(path.join(process.cwd(), 'frontend', 'dist')));

// Middleware
app.use(express.json());
app.use((req : Request, _ : Response, next : NextFunction) => {
    loggingService.debug('Request received:');
    loggingService.debug('Method:', req.method);
    loggingService.debug('URL:', req.url);
    loggingService.debug('Headers:', req.headers);
    loggingService.debug('Body:', req.body);
    next();
});

// Routes
app.use('/api', ApiRoute);
app.use('/json-api', JsonApiRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});

// Start the server
const server : Server = http.createServer(app);

const io = new SocketIOServer(server);
socketService.registerIo(io);

server.listen(port, () => {
    loggingService.log(`Server running at http://localhost:${port}`);
});