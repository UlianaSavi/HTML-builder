const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

((async () => {
    const files = await fsPromises.readdir('05-merge-styles/styles');
    const wr = fs.createWriteStream(path.join(`${__dirname}/project-dist`, 'bundle.css'));
    await Promise.all(files.map(async (file) => {
        if (path.extname(file) !== '.css') {
            return;
        }
        console.log(file);

        const rr = fs.createReadStream(path.join(`${__dirname}/styles`, file));
        rr.on('readable', () => {
            const content = rr.read();
            if (content) {
                wr.write(`${content}`)
            }
        });
    }));
})())