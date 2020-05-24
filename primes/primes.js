const fs = require('fs');

const n = Number(process.argv[2]);

const numbers = new Uint8Array(n + 1);

for (let i = 0; i <= n; ++i)
    numbers[i] = 1;


const startTime = new Date().getTime();

let k;
for (let i = 2; i*i <= n; ++i) {
    if (numbers[i] == 1) {
        for (k = 2*i; k <= n; k += i)
            numbers[k] = 0;
    }
}

const finishTime = new Date().getTime();
console.log("Eratostenes loops: ", (finishTime - startTime)/1000);

const fileStartTime = new Date().getTime();

let file = fs.openSync('./result.js.txt', 'w');
numbers.forEach((isPrime, num) => {
    if (isPrime) fs.writeSync(file, num + '\n'); 
})

const finishFileTime = new Date().getTime();

console.log("File writting: ", (finishFileTime - fileStartTime)/1000);
console.log("summary: ", (finishFileTime - startTime)/1000);



