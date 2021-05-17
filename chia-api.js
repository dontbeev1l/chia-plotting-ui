const { spawn } = require('child_process');

const CHIA_EXE_PATH = require('./chia-exe-path')();

module.exports = {
    plots: {
        create: (params) => {
            params = params || {};
            params.size = params.size || 32;
            params.num = params.num || 1;
            params.buffer = params.buffer || 3389;
            params.num_threads = params.num_threads || 2;
            params.buckets = params.buckets || 128;

            if (!params.tmp_dir) { throw new Error(`params.tmp_dir is required`) }
            if (!params.final_dir) { throw new Error(`params.final_dir is required`) }

            const args = ['plots', 'create'];

            Object.keys(params).forEach(key => {
                args.push(`--${key}`, params[key]);
            });

            console.log(`${CHIA_EXE_PATH} ${args.join(' ')}`);

            const process = spawn(CHIA_EXE_PATH, args);

            process.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });

            process.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });

            return {
                process
            };
        }
    }
}