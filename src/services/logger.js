/**
 * System and 3rd party libs
 */
const log4js = require('log4js');
const morgan = require('morgan');
/**
 * Declarations & Implementations
 */
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        allLogs: { type: 'file', filename: 'all.log', maxLogSize: 10485760, backups: 10, compress: true },
        outFilter: {
            type: 'logLevelFilter',
            appender: 'out',
            level: 'all'
        },
        allErrorlog:{ type: 'file', filename: 'error.log', maxLogSize: 10485760, backups: 10, compress: true },
    },
    categories: { default: { appenders: ['allLogs', 'outFilter','allErrorlog'], level: 'all' } },
});

let log = log4js.getLogger();
log.level = process.env.LOG_LEVEL || 'all';
let morganInstance = morgan('dev',{
    stream: {
        write: (str) => {log.debug(str)}
    }
});

/**
 * Service Export
 */
module.exports = {
    log: log,
    morgan: morganInstance,
    log4js

};
