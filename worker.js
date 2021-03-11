const { workerData, parentPort } = require('worker_threads');
const crypto = require('crypto');
const lineByLine = require('n-readlines');

const liner = new lineByLine(`./dictionary/${workerData.split(" ")[1]}.txt`);
const hash = workerData.split(" ")[0];
const type = hash.length === 32 ? 'md5' : hash.length === 64 ? 'sha256' : hash.length === 86 ? 'sha256(authme)' : null;

let password;
if(type === "sha256(authme)") {
    let hash_$3 = hash.split("$")[3].toLowerCase();
    let hash1_$2 = hash.split("$")[2];
    while(password = liner.next()) {
        password = password.toString('utf8').replace('\r', '');
        if (hash_$3 === crypto.createHash('sha256').update(crypto.createHash('sha256').update(password).digest('hex') + hash1_$2).digest('hex').toLowerCase()) {
            return parentPort.postMessage({success: true, password: password.toString('utf8').replace('\r', '')});
        }
    }
} else while(password = liner.next()) if (hash === crypto.createHash(type).update(password.toString('utf8').replace('\r', '')).digest('hex')) return parentPort.postMessage({success: true, password: password.toString('utf8').replace('\r', '')});

parentPort.postMessage({success: false});
