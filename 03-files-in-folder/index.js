const fs = require('fs/promises');
const path = require('path');

((async () => {
    const files = await fs.readdir('03-files-in-folder/secret-folder/');

    await Promise.all(files.map(async (file) => {
        const stat = await fs.stat(path.join(`${__dirname}/secret-folder`, file));
        if (stat.isDirectory()) {
            return;
        }
        console.log((`<${file}> <${path.extname(file)}> <${stat.size}>`));
    }));
})())
