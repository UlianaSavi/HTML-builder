const fs = require('fs/promises');
const path = require('path');

((async () => {
    await fs.mkdir('04-copy-directory/files-copy', { recursive: true });
    const files = await fs.readdir('04-copy-directory/files');
    console.log(files);

    await Promise.all(files.map(async (file) => {
        await fs.copyFile(path.join(`${__dirname}/files`, file), path.join(`${__dirname}/files-copy`, file));
    }));
})())
