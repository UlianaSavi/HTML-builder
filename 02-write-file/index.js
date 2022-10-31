const path = require('path');
const fs = require('fs');
const readline = require('node:readline');
const { stdin: input, stdout: output} = require('node:process');

const wr = fs.createWriteStream(path.join(__dirname, 'text.txt'));

wr.write('');

const rl = readline.createInterface({ input, output });

function ask(question) {
    rl.question(question, (answer) => {
        if (answer === 'exit') {
            console.log('Bye my friend!');
            wr.end();
            rl.close();
            return;
        }

        wr.write(`${answer}`);
        ask('What do you think of Node.js? ');
    });
}

ask('What do you think of Node.js? ');

rl.on('SIGINT', () => {
    console.log('\nBye my friend!');
    rl.close();
});
