'use strict';
/**
 *
 * CLI related tasks.
 *
 */

// Dependencies.
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');

class _events extends events { };
const e = new _events();

// Instantiate the CLI module object.
const cli = {};

// Input handlers.

// Man.
e.on('man', function (str) {
    cli.responders.help();
});

// Help.
e.on('help', function (str) {
    cli.responders.help();
});

// Exit.
e.on('exit', function (str) {
    cli.responders.exit();
});

// Stats.
e.on('stats', function (str) {
    cli.responders.stats();
});

// List users.
e.on('list users', function (str) {
    cli.responders.listUsers();
});

// More user info.
e.on('more user info', function (str) {
    cli.responders.moreUserInfo(str);
});

// List chacks.
e.on('list checks', function (str) {
    cli.responders.listChecks(str);
});

// More check info.
e.on('more check info', function (str) {
    cli.responders.moreCheckInfo(str);
});

// List logs.
e.on('list logs', function (str) {
    cli.responders.listLogs();
});

// More log info.
e.on('more log info', function (str) {
    cli.responders.moreLogInfo(str);
});

// Responders object.
cli.responders = {};

// Help / Man
cli.responders.help = function () {
    console.log('You asked for help.');
};

// Exit.
cli.responders.exit = function () {
    console.log('You asked for exit.');
};

// Stats.
cli.responders.stats = function () {
    console.log('You asked for stats.');
};

// List users.
cli.responders.listUsers = function () {
    console.log('You asked for list users.');
};

// More user info.
cli.responders.moreUserInfo = function (str) {
    console.log('You asked for more user info', str);
};

// List checks.
cli.responders.listChecks = function (str) {
    console.log('You asked to list checks', str);
};

// More check info.
cli.responders.moreCheckInfo = function (str) {
    console.log('You asked for more check info', str);
};

// List logs.
cli.responders.listLogs = function () {
    console.log('You asked to list logs');
};

// More log info.
cli.responders.moreLogInfo = function (str) {
    console.log('You asked for more log info', str);
};

// Input processor.
cli.processInput = function (str) {
    str = typeof (str) == 'string' & str.trim().length > 0 ? str.trim() : false;
    // Only process the input if the user actually wrote something, otherwise ignore it.
    if (str) {
        // Codify the unique strings that identify the unique questions allowed to be asked.
        const uniqueInputs = [
            'man',
            'help',
            'exit',
            'stats',
            'list users',
            'more user info',
            'list checks',
            'more check info',
            'list logs',
            'more log info'
        ];
        // Go through the possible inputs, emit an event when a match is found.
        let matchFound = false;
        let counter = 0;
        uniqueInputs.some(function (input) {
            if (str.toLowerCase().indexOf(input) > -1) {
                matchFound = true;
                // Emit an event matching the unique input and include the full string given.
                e.emit(input, str);
                return true;
            }
        });
        // In no match is found, tell the user to try again.
        if (!matchFound) {
            console.log('\x1b[34m%s\x1b[0m', 'Sorry, try again...');
        }
    }
};

// Init script.
cli.init = function () {
    // Send the start message to the console, in dark blue.
    console.log('\x1b[34m%s\x1b[0m', `The CLI is running running...`);
    // Start the interface.
    const _interface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        promt: '>'
    });
    // Create an initial promt.
    _interface.prompt();
    // Handle each line of input separately.
    _interface.on('line', function (str) {
        // Send to the input processor.
        cli.processInput(str);
        // Re-initialize the promt afterwards.
        _interface.prompt();
    });
    // If the user stops the CLI, kill the associated process.
    _interface.on('close', function () {
        process.exit(0);
    });

};

// Export the module.
module.exports = cli;