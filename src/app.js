const http = require('http');
const handleRequest = require('./handler.js');

let server = http.createServer((request, response) => {
    if (request.headers["X-Gitlab-Token "] === process.env.inttoken) {
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            handleRequest(body);
            response.writeHead(204);
            response.end();
        });
    } else {
        response.writeHead(403);
        response.end();
    }
});
server.listen(process.env.port);
