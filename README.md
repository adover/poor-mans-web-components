# Poor Mans Components

For when writing HTML and CSS is too old school, but the new school isn't that reliable just yet.

## Getting started

Run `npm install`
Run `npm start` to spin up your environment. The index page contains a mock page where components can get injected.

It's best to work from a componentised approach, keeping all your code separate.

`npm run generate <NAME>` will generate a set of component files for you. All you then need to do is add the reference to the index file and you're set. The `componentManifest.js` file in the build folder updates each time you do this. If you ever change a components name it needs to be updated here.

## Configuration

### Navigating

The `index.handlebars` page is generated from an `index.js` file. This contains an array of rows which contain columns. If there's 1 column it will simply be a string, otherwise an array of strings.

### Components

Not written yet.

### Building

`npm run build` will build the components and inject minified CSS and JS into the file. Once that's run a script will remove the head tag which gets forced in due to a bug.
