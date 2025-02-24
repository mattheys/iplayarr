import version from './version.js';
import queue from './queue.js';
import history from './history.js';
import caps from './caps.js';
import tvsearch from './tvsearch.js';
import downloadNzb from './downloadNzb.js';
import addfile from './addfile.js';
import getConfig from './getConfig.js';

export const directory = {
    version: version,
    queue: queue,
    history: history,
    caps: caps,
    tvsearch: tvsearch,
    "nzb-download": downloadNzb,
    addfile: addfile,
    get_config: getConfig
};