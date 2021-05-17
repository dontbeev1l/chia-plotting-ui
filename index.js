const chiaApi = require('./chia-api');
const fs = require('fs');

const processes = [];

// const TMP_DIR = ;

function createProcess(tmp_dir) {
    const startTimestamp = Date.now();
    const process = { startTimestamp, logs: [] };
    processes.push(process);

    const plot = chiaApi.plots.create({ tmp_dir, final_dir: 'G:\\', buffer: 3389, num_threads: 1, buckets: 112 });

    process.tmp_dir = tmp_dir

    plot.process.stdout.on('data', (buffer) => {
        const logStr = buffer.toString();

        if (!process.id && logStr.match(/ID\: (.*)/)) {
            process.id = logStr.match(/ID\: (.*)/)[1];
        }

        process.logs.push([Date.now(), new Date().toLocaleTimeString(), logStr]);
        if (process.logs.length > 10) {
            process.logs.shift();
        }

        const checkPlot2Tmp = () => {
            fs.readdirSync(tmp_dir).forEach(item => {
                if (item.match(new RegExp(`.*${process.id}\.plot\.2\.tmp$`, 'g'))) {
                    process.plot2TmpName = item;
                }
            });
            if (!process.plot2TmpName) {
                setTimeout(() => checkPlot2Tmp(), 1000);
            }
        }
        checkPlot2Tmp();

        if (process.plot2TmpName) {
            const stats = fs.statSync(tmp_dir + process.plot2TmpName);
            process.plot2TmpSize = stats.size;
        }
    })
}

// EXPRESS
const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.send(processes);
});

app.listen(3000)
// END:EXPRESS

const TMP = ['G:\\tmp\\', 'E:\\', 'E:\\']
for (let i = 0; i < TMP.length; i++) {
    setTimeout(() => createProcess(TMP[i]), 1000 * 60 * 60 * (i == 0 ? 0 : i - 1));
}
