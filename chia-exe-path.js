const os = require('os');
const fs = require('fs');

const username = os.userInfo().username;

const CHIA_APP_PARENT_PATH = `C:/Users/%username%/AppData/Local/chia-blockchain`;
const CHIA_EXE_PATH = `${CHIA_APP_PARENT_PATH}/app-%chiaVersion%/resources/app.asar.unpacked/daemon/chia.exe`;

function inserParams(str, params) {
    Object.keys(params).forEach(key => {
        str = str.replace(`%${key}%`, params[key]);
    })

    return str;
}

function getChiaVersion() {
    const dirs = fs.readdirSync(inserParams(CHIA_APP_PARENT_PATH, { username }));
    for (let dir of dirs) {
        const match = dir.match(/app\-(\d.\d.\d)/);
        if (match) {
            return match[1];
        }
    }
}

const chiaVersion = getChiaVersion();

module.exports = chiaExePath = () => {
    return inserParams(CHIA_EXE_PATH, { username, chiaVersion });
}
