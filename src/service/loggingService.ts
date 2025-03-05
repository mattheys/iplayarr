import { IplayarrParameter } from "../types/IplayarrParameters";
import { getParameter } from "./configService";
import socketService from "./socketService";

const loggingService = {
    log: (...params : any[]) => {
        console.log(...params);
        const message = joinOrReturn(params);
        socketService.emit('log', {id: 'SYSTEM', message, timestamp : new Date()});
    },

    error: (...params : any[]) => {
        console.error(params);
        const message = joinOrReturn(params);
        socketService.emit('log', {id: 'SYSTEM-ERROR', message, timestamp : new Date()});
    },

    debug: (...params : any[]) => {
        getParameter(IplayarrParameter.DEBUG).then((debug) => {
            const message = joinOrReturn(params);
            if (debug && debug.toLowerCase() == 'true'){
                console.log(...params);
                socketService.emit('log', {id: 'SYSTEM-DEBUG', message, timestamp : new Date()});
            }
        });
    },
}

function joinOrReturn(input : string | any[]) {
    if (Array.isArray(input)) {
      return input.map((item : any) => {
        if (typeof item === 'string'){
            return item;
        } else {
            return JSON.stringify(item, null, 2);
        }
      }).join(' ');
    } else if (typeof input === 'string') {
      return input;
    }
    return null;
  }

export default loggingService;