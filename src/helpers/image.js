const handlebars = require('handlebars');

module.exports = image => {
    const attrs = Object.keys(image).map(
        k => (k !== 'src' ? `${k}="${image[k]}"` : null),
    );

    return new handlebars.SafeString(
        `<img src="${require(`../img/${image.src}`)}" ${attrs.join(' ')} />`,
    );
};
