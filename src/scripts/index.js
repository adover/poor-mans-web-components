import row from '../partials/row.handlebars';

/**
 * Define all rows here by referencing the component's name as a string
 */

const rows = [['component-name']];

const insert = (name, rowIndex, itemIndex = 0) => {
    try {
        if (name) {
            const template = require(`../components/${name}/${name}.handlebars`);
            const data = require(`../components/${name}/${name}_data`);

            const currentRow = document.querySelectorAll('.dynamicContentRow')[
                rowIndex
            ];

            currentRow.querySelectorAll('.dynamicContentColumn')[
                itemIndex
            ].innerHTML = template(data);
        }
    } catch (e) {
        console.log(e);
        console.log(name);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.dynamicContentContainer');

    rows.forEach((r, i) => {
        canvas.insertAdjacentHTML('beforeend', row());
        if (r.length > 1) {
            r.forEach((c, j) => {
                insert(r, i, j);
            });
        } else {
            insert(r, i);
        }
    });
});
