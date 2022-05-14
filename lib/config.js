'use strict';
/*
 *
 * Configuration variables.
 *
 *
 */

// Container for all the environments.
const environments = {};

// Staging (default) environment.
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'Staging',
    'hashingSecret': 'stagSecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'ACcc2a6b1dbfca45f09dffee061df81be2',
        'authToken': '917f9e7030595e70f4e86ab030d46a2e',
        'fromPhone': '+19705917634'
    }
};

// Production environment.
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'Production',
    'hashingSecret': 'prodSecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'ACcc2a6b1dbfca45f09dffee061df81be2',
        'authToken': '917f9e7030595e70f4e86ab030d46a2e',
        'fromPhone': '+19705917634'
    }
};

// Determine which environment was passed as a command-line argument.
const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging.
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module.
module.exports = environmentToExport;
