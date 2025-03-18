import { FixedFIFOQueue } from '../types/FixedFIFOQueue';
import { SearchHistoryEntry } from '../types/SearchHistoryEntry';

const history : FixedFIFOQueue<SearchHistoryEntry> = new FixedFIFOQueue(10);

const searchHistoryService = {
    addItem : (entry : SearchHistoryEntry) : void => {
        history.enqueue(entry);
    },

    getHistory : () : SearchHistoryEntry[] => {
        return history.getItems();
    }
}

export default searchHistoryService;