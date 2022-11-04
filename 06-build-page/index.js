const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const readline = require('readline');

async function clean(dir) {
    try {
        await fsPromises.stat(dir);
        const entries = await fsPromises.readdir(dir, { withFileTypes: true });
        await Promise.all(entries.map(async (entry) => {
            let fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? await clean(fullPath) : await fsPromises.unlink(fullPath);
        }));
        await fsPromises.rmdir(dir);
    } catch (err) {
        return;
    }
}

async function createFolder() {
    await fsPromises.mkdir(path.join(`${__dirname}/project-dist/`), {
        recursive: true
    });
    await fsPromises.mkdir(path.join(`${__dirname}/project-dist/assets`), {
        recursive: true
    });
}

async function getComponents() {
    const components = await fsPromises.readdir(path.join(`${__dirname}/components`));
    return components
        .reduce((acc, val) => ({
            ...acc,
            [val.split('.').slice(0, -1).join('.')]: path.join(__dirname, 'components', val),
        }), {});
}

async function processHtml(pathName = '', wr, components) {
    if (!pathName) {
        throw new Error('Incorrect path')
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'template.html')),
        output: process.stdout,
        terminal: false
    });
    for await (const line of rl) {
        const regExp = /.*\{\{(.*)\}\}/gm;
        const hasHtml = regExp.test(line);

        if (hasHtml) {
            const pathToFile = components[line.replace(/.*\{|\}/g, '')];
            const hasFile = await fsPromises.stat(pathToFile);
            if (hasFile) {
                const html = await fsPromises.readFile(pathToFile, {
                    encoding: 'utf8'
                });

                wr.write(line.replace(regExp, html).replace(/\s{2,}/g, ''));
            }
            continue;
        }
        wr.write(line.replace(/\s{2,}/g, ''));
    }
}

async function mergeStyles() {
    const styles = await fsPromises.readdir(path.join(`${__dirname}/styles/`));
    const wrCss = fs.createWriteStream(path.join(`${__dirname}/project-dist`, 'style.css'));
    await Promise.all(styles.map(async (style) => {
        if (path.extname(style) !== '.css') {
            return;
        }
        const rr = fs.createReadStream(path.join(`${__dirname}/styles`, style));
        rr.on('readable', () => {
            const content = rr.read();
            if (content) {
                wrCss.write(`${content}`)
            }
        });
    }));
}

async function copyDir() {
    const dirs = await fsPromises.readdir(path.join(`${__dirname}/assets/`));
    await Promise.all(dirs.map(async (dir) => {
        const files = await fsPromises.readdir(path.join(`${__dirname}/assets/${dir}/`));
        await fsPromises.mkdir(path.join(`${__dirname}/project-dist/assets/${dir}`));
        await Promise.all(files.map(async (item) => {
            await fsPromises.copyFile(path.join(`${__dirname}/assets/${dir}`, item), path.join(`${__dirname}/project-dist/assets/${dir}`, item));
        }));
    }));
}

((async () => {
    await clean(path.join(`${__dirname}/project-dist/`));
    await createFolder();
    const wr = fs.createWriteStream(path.join(`${__dirname}/project-dist`, 'index.html'));
    const components = await getComponents();
    await processHtml('06-build-page/', wr, components);
    await mergeStyles();
    await copyDir();
})())