'use strict';
/**
 *
 * Configuration variables.
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
        'accountSid': 'accountSidaccountSidaccountSid',
        'authToken': 'authTokenauthTokenauthToken',
        'fromPhone': '+19705517674'
    },
    'templateGlobals': {
        'appName': 'URL uptime checker',
        'companyName': 'ONX LLC',
        'yearCreated': '2022',
        'baseUrl': 'http://localhost:3000/'
    }
};

// Testing environment.
environments.testing = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'Testing',
    'hashingSecret': 'stagSecret',
    'maxChecks': 5,
    'twilio': {
        'accountSid': 'accountSidaccountSidaccountSid',
        'authToken': 'authTokenauthTokenauthToken',
        'fromPhone': '+19705517674'
    },
    'templateGlobals': {
        'appName': 'URL uptime checker',
        'companyName': 'ONX LLC',
        'yearCreated': '2022',
        'baseUrl': 'http://localhost:4000/'
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
        'accountSid': 'accountSidaccountSidaccountSid',
        'authToken': 'authTokenauthTokenauthToken',
        'fromPhone': '+19705517674'
    },
    'templateGlobals': {
        'appName': 'URL uptime checker',
        'companyName': 'ONX LLC',
        'yearCreated': '2022',
        'baseUrl': 'http://localhost:5000/'
    }
};

// Determine which environment was passed as a command-line argument.
const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging.
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module.
module.exports = environmentToExport;
