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
const os = require('os');
const v8 = require('v8');
const _data = require('./data');
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
    const commands = {
        ' • exit': 'Kill the CLI and the rest of the application.',
        ' • man': 'Show the help page.',
        ' • help': 'Alias of the "man" command.',
        ' • stats': 'Get statistics on the underlying operation system and resource utilization.',
        ' • list users': 'Show a list of all the resgistered (undelated) users in the system.',
        ' • more user info --{userId}': 'Show details of a specific user.',
        ' • list checks --up -- down': 'Show a list of all the active checks in the system, including their state. The "--up" and the "--down" flags are both optional.',
        ' • more check info --{checkId}': 'Show details of a specified check.',
        ' • list logs': 'Show a list of all the logs available to be read (compressed and uncompressed).',
        ' • more log info --{fileName}': 'Show details of a specified log file.'
    };
    // Show a header for the help page that is as wide as the creen.
    cli.horizontalLine();
    cli.centered('CLI MANUAL');
    cli.horizontalLine();
    cli.verticalSpace(2);
    // Show each command, followed by its explanation, in white and yellow respectively.
    for (let key in commands) {
        if (commands.hasOwnProperty(key)) {
            let value = commands[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);
    // End with another horizontalLine.
    cli.horizontalLine();
};

// Create a vertical space.
cli.verticalSpace = function (lines) {
    lines = typeof (lines) == 'number' && lines > 0 ? lines : 1;
    for (let i = 0; i < lines; i++) {
        console.log(' ');
    }
};

// Create a horizontal line across the screen.
cli.horizontalLine = function () {
    // Get the available screen size
    let width = process.stdout.columns;
    // Put in enough dashes to go across the screen
    let line = '';
    for (let i = 0; i < width; i++) {
        line += '-';
    }
    console.log(line);
};

// Create centered text on the screen.
cli.centered = function (str) {
    str = typeof (str) == 'string' && str.trim().length > 0 ? str.trim() : '';
    // Get the available screen size.
    let width = process.stdout.columns;
    // Calculate the left padding there should be.
    let leftPadding = Math.floor((width - str.length) / 2);
    // Put in left padded spaces before the string itself.
    let line = '';
    for (let i = 0; i < leftPadding; i++) {
        line += ' ';
    }
    line += str;
    console.log(line);
};

// Exit.
cli.responders.exit = function () {
    process.exit(0);
};

// Stats.
cli.responders.stats = function () {
    // Compile an object of stats.
    const stats = {
        ' • Load Avarage': os.loadavg().join(' '),
        ' • CPU Count': os.cpus().length,
        ' • Free Memory': os.freemem(),
        ' • Current Malloced Memory ': v8.getHeapStatistics().malloced_memory,
        ' • Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
        ' • Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
        ' • Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
        ' • Uptime': os.uptime() + ' Secconds.'
    };
    // Create Header for the stats.
    cli.horizontalLine();
    cli.centered('SYSTEM STATISTICS');
    cli.horizontalLine();
    cli.verticalSpace(2);
    // Log out each stats.
    for (let key in stats) {
        if (stats.hasOwnProperty(key)) {
            let value = stats[key];
            let line = '\x1b[33m' + key + '\x1b[0m';
            let padding = 60 - line.length;
            for (let i = 0; i < padding; i++) {
                line += ' ';
            }
            line += value;
            console.log(line);
            cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);
    // End with another horizontalLine.
    cli.horizontalLine();
};

// List users.
cli.responders.listUsers = function () {
    _data.list('users', function (err, userIds) {
        if (!err && userIds && userIds.length > 0) {
            cli.verticalSpace();
            userIds.forEach(function (userId) {
                _data.read('users', userId, function (err, userData) {
                    if (!err && userData) {
                        let line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ' Phone: ' + userData.phone + ' Checks: ';
                        const numberOfChecks = typeof (userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                });
            });
        }
    });
};

// More user info.
cli.responders.moreUserInfo = function (str) {
    // Get ID from string
    const arr = str.split('--');
    const userId = typeof (arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if (userId) {
        // Lookup the user
        _data.read('users', userId, function (err, userData) {
            if (!err && userData) {
                // Remove the hashed password
                delete userData.hashedPassword;
                delete userData.tosAgreement;
                // Print their JSON object with text highlighting
                cli.verticalSpace();
                console.dir(userData, { 'colors': true });
                cli.verticalSpace();
            }
        });
    }
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