const CURR_DIR = process.cwd();
const fs = require('fs');
const { join } = require('path');

const componentToMake = process.argv[2];
const componentDir = `${CURR_DIR}/src/components/`;
const manifest = `${CURR_DIR}/build/componentManifest.js`;
const fullPath = `${componentDir}${componentToMake}`;
const isDirectory =
    fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory();
const validFile = fileName => /^([A-Za-z0-9\-\_]+)$/i.test(fileName);
const template = `${componentDir}template`;
const dirs = p =>
    fs.readdirSync(p).filter(f => fs.statSync(join(p, f)).isDirectory());

console.log(`Attempting to create component files for ${componentToMake}`);

const createDirectory = path => {
    if (!fs.existsSync(`${componentDir}${path}`)) {
        fs.mkdirSync(`${componentDir}${path}`);
    }

    const filesToCreate = fs.readdirSync(template);

    filesToCreate.forEach(file => {
        const origFilePath = `${template}/${file}`;
        const stats = fs.statSync(origFilePath);

        let renamed = file.split('.');

        renamed = [renamed[0].replace('template', path), renamed[1]].join('.');

        if (stats.isFile()) {
            const contents = fs.readFileSync(origFilePath, 'utf8');

            const writePath = `${componentDir}${path}/${renamed}`;
            fs.writeFileSync(writePath, contents, 'utf8');
        }
    });

    fs.appendFileSync(
        `${componentDir}${path}/${path}.js`,
        `import './${path}.scss';`,
    );

    updateWebpackComponentList();
};

const updateWebpackComponentList = () => {
    const components = dirs(componentDir).filter(d => d !== 'template');
    const script = `module.exports = ${JSON.stringify(components)} `;
    fs.writeFileSync(manifest, script);
};

if (componentToMake && validFile(componentToMake) && !isDirectory) {
    createDirectory(componentToMake);
} else {
    throw new Error('Invalid file path');
}

console.log('Successfully created component files');

process.exit();
