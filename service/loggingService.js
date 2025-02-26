import socketService from './socketService.js';
import { getParameter } from './configService.js';

const loggingService = {
    log: (...params) => {
        console.log(...params);
        const message = params.join(" ");
        socketService.emit('log', {id: 'SYSTEM', message, timestamp : new Date()});
    },

    error: (...params) => {
        console.error(params);
        const message = params.join(" ");
        socketService.emit('log', {id: 'SYSTEM-ERROR', message, timestamp : new Date()});
    },

    debug: (...params) => {
        const debug = getParameter("DEBUG");
        const message = params.join(" ");
        if (debug && debug.toLowerCase() == 'true'){
            loggingService.log(...params);
        }
        socketService.emit('log', {id: 'SYSTEM-DEBUG', message, timestamp : new Date()});
    },
}

export default loggingService;