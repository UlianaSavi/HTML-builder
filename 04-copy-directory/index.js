const fs = require('fs/promises');
const path = require('path');

((async () => {
    await clean(path.join(`${__dirname}/files-copy/`));
    await fs.mkdir('04-copy-directory/files-copy', { recursive: true });
    const files = await fs.readdir('04-copy-directory/files');
    console.log(files);

    await Promise.all(files.map(async (file) => {
        await fs.copyFile(path.join(`${__dirname}/files`, file), path.join(`${__dirname}/files-copy`, file));
    }));
})())

async function clean(dir) {
    try {
        await fs.stat(dir);
        const entries = await fs.readdir(dir, { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            let fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? await clean(fullPath) : await fs.unlink(fullPath);
        }));
        await fs.rmdir(dir);
    } catch (err) {
        return;
    }
}