import bunyan from 'bunyan';
import RotatingFileSystem from 'bunyan-rotating-file-stream';
// Below sets up the logging system for the app using bunyan.
// Any logs that are info or error are logged first to the stdout
// then logged into each of their own files respectively.
// After a day or a file size. The files are rolled over for the next messages.
const options = {
    name: 'slack_app',
    streams: [{
        level: 'info',
        stream: process.stdout,

    },
    {
        level: 'info',
        stream: new RotatingFileSystem({
            path: './server/logs/log.info',
            period: '1d',
            totalFiles: 10,
            rotateExisting: true,
            threshold: '10k',
            totalSize: '20k',
            gzip: true,
        }),
    },
    {
        level: 'error',
        stream: process.stdout,

    },
    {
        level: 'error',
        stream: new RotatingFileSystem({
            path: './server/logs/log.error',
            period: '1d',
            totalFiles: 10,
            rotateExisting: true,
            threshold: '10k',
            totalSize: '20k',
            gzip: true,
        }),
    },
    ]};

const log = bunyan.createLogger(options);

export default {
    log,
};

