const path = require('path');
const fs = require('fs');

const rr = fs.createReadStream(path.join(__dirname, 'text.txt'));

rr.on('readable', () => {
    const content = rr.read();
    if (content) {
        console.log(`${content}`);
    }
});
