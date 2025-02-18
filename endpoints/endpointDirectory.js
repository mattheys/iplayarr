import version from './version.js'
import getConfig from './getConfig.js'
import queue from './queue.js'
import history from './history.js'
import test from './test.js'

export const directory = {
    "version" : version,
    "get_config" : getConfig,
    "queue" : queue,
    "history" : history,
    "test" : test
}