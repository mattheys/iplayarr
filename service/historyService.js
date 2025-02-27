import storage from 'node-persist';
import socketService from './socketService.js';

let isStorageInitialized = false;

async function initStorage() {
  if (!isStorageInitialized) {
    await storage.init();
    isStorageInitialized = true;
  }
}

const historyService = {
    getHistory : async () => {
        await initStorage();
        return (await storage.getItem("history")) ?? [];
    },

    addHistory : async (item) => {
        const historyItem = {...item, eta: "", speed: "", progress: "100"}
        await initStorage();
        const history = await historyService.getHistory();
        history.push(historyItem);
        await storage.setItem("history", history);
        socketService.emit("history", history);
    },

    removeHistory : async (pid) => {
        await initStorage();
        let history = await historyService.getHistory();
        history = history.filter(({id}) => id !== pid);
        await storage.setItem("history", history);
        socketService.emit("history", history);
    }
}

export default historyService;