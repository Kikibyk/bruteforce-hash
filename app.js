const { Worker } = require('worker_threads');
let end = 0;

if(!process.argv[2]) return console.error(`You have not specified a hash!\nnode app.js [hash]`);

console.log(`\x1b[36m> \x1b[0mBrute force started..`);

for(let i = 1; i < 18; i++) {
    let worker = new Worker(`./worker.js`, {workerData: `${process.argv[2]} ${i}`});
    worker.on('message', (data) => {
        if(!data.success) end++;
        else {
            console.log(`\x1b[32m> \x1b[0mPassword found: ${data.password}`);
            process.exit();
        }

        if(end === 17 && !data.success) {
            console.log(`\x1b[31m> \x1b[0mPassword not found\n`);
            process.exit();
        }
    });
}