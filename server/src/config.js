import bunyan from 'bunyan';
import RotatingFileSystem from 'bunyan-rotating-file-stream';

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
    ]};

const log = bunyan.createLogger(options);

export default {
    log,
};

