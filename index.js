'use strict';
/*
 *
 * Pimary file for the API.
 *  
 */

// Dependencies.
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// Instantiate the HTTP server.
const httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Instantiate the HTTPS server.
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTP server.
httpServer.listen(config.httpPort, function () {
    console.log(`The HTTP server is running in "${config.envName}" mode and listening on port: ${config.httpPort}...`);
});

// Start the HTTPS server.
httpsServer.listen(config.httpsPort, function () {
    console.log(`The HTTPS server is running in "${config.envName}" mode and listening on port: ${config.httpsPort}...`);
});


// All the server logic for both the http and https server.
const unifiedServer = function (req, res) {
    // Get the URL and parse it.
    const parsedUrl = url.parse(req.url, true);

    // Get the path.
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object.
    const queryStringObject = parsedUrl.query;

    // Get the HTTP Method.
    const method = req.method.toLocaleLowerCase();

    // Get the headers as an object.
    const headers = req.headers;

    // Get the payload, if any.
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {

        buffer += decoder.end();

        // Choose the handler this request should go to, if one is not found, use the notFound handler.
        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler.
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router.
        chosenHandler(data, function (statusCode, payload) {
            // Use the status code called back by the handler, or default to 200.
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object.
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload to a string.
            const payloadString = JSON.stringify(payload);

            // Return the response.
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log.
            console.log('Returning response:', statusCode, payloadString);
        });
    });
};

// Define a request router.
const router = {
    'ping': handlers.ping,
    'users': handlers.users
};