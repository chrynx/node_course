/*
    Primary file for the API
 */

const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// HTTP Server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req,res);
});
httpServer.listen(config.http, function(){
   console.log("The server is listening on port " + config.http + " in the " + config.envName + " environment");
});

// HTTPS Server
const httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req,res);
});
httpsServer.listen(config.https, function(){
    console.log("The server is listening on port " + config.https + " in the " + config.envName + " environment");
});

const unifiedServer = function(req,res) {

    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryStringObject = parsedURL.query;
    const method = req.method.toLowerCase();
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();

        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'buffer': buffer
        };

        chosenHandler(data, function(statusCode,payload){

            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload: {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Request response: ', statusCode, payloadString);
        });
    });
};

const handlers = {};

handlers.ping = function(data,callback){
    callback(200);
};

handlers.notFound = function(data,callback){
    callback(404);
};

const router = {
    'ping': handlers.ping
};