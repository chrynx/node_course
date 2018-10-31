/*
    Primary file for the API
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer(function(req, res){
    // Get URL and parse
    const parsedURL = url.parse(req.url, true);
    // Get the path
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // Get the query string as an object
    const queryStringObject = parsedURL.query;
    // Get the HTTP Method
    const method = req.method.toLowerCase();
    // Get the headers as an object
    const headers = req.headers;
    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();
        // Choose the handler this request should go to
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        // Construct data object for handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'buffer': buffer
        };
        // Route the request to the handler
        chosenHandler(data, function(statusCode,payload){
            // use statusCode by handler or default 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            // use payload by handler or default nothing
            payload = typeof(payload) === 'object' ? payload: {};
            // convert payload
            const payloadString = JSON.stringify(payload);
            // send response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Request response: ', statusCode, payloadString);
        });
    });
});

// Start the server, and have it listen on port 3000
server.listen(3000, function(){
   console.log("The server is listening on port 3000");
});
// Define the handlers
const handlers = {};
handlers.sample = function(data, callback){
    // Callback a http status code, and a payload object
    callback(406,{
        'name': 'sample handler'
    });
};
handlers.notFound = function(data,callback){
    callback(404);
};
// Define a request router
const router = {
    'sample': handlers.sample
}