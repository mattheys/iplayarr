import storage from 'node-persist';

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

    addHistory : async (historyItem) => {
        await initStorage();
        const history = await historyService.getHistory();
        history.push(historyItem);
        await storage.setItem("history", history);
    },

    removeHistory : async () => {
        await initStorage();
    }
}

export default historyService;