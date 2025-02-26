import socketService from './socketService.js';
import { getParameter } from './configService.js';

const loggingService = {
    log: (...params) => {
        console.log(...params);
        const message = JSON.stringify(params);
        socketService.emit('log', {id: 'SYSTEM', message, timestamp : new Date()});
    },

    error: (...params) => {
        console.error(params);
        const message = JSON.stringify(params);
        socketService.emit('log', {id: 'SYSTEM-ERROR', message, timestamp : new Date()});
    },

    debug: (...params) => {
        const debug = getParameter("DEBUG");
        const message = JSON.stringify(params);
        if (debug && debug.toLowerCase() == 'true'){
            console.log(...params);
        }
        socketService.emit('log', {id: 'SYSTEM-DEBUG', message, timestamp : new Date()});
    },
}

export default loggingService;