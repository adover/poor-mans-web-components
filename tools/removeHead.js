const path = require('path'),
    fs = require('fs');

const replace = require('replace-in-file');

const fromDir = (startPath, filter) => {
    if (!fs.existsSync(startPath)) {
        console.log('no dir ', startPath);
        return;
    }

    const files = fs.readdirSync(startPath);
    const filesWithExtension = [];

    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter);
        } else if (filename.indexOf(filter) >= 0) {
            console.log('-- found: ', filename);
            filesWithExtension.push(filename);
        }
    }

    return filesWithExtension;
};

const changes = replace.sync({
    files: fromDir('./dist', '.html'),
    from: /<[\/head^>]{4,5}>/g,
    to: '',
});

process.exit();
