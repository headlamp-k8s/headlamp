const yargs = require('yargs/yargs');
const { addCommands } = require('./plugin-management-utils.js');

const yargsInstance = yargs(process.argv.slice(2));
addCommands(yargsInstance);
yargsInstance.demandCommand(1, '').strict().help().argv;
