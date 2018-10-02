const http = require('http');
const handleRequest = require('./handler.js');
const fs = require('fs');

const GL_SECRET = fs.readFileSync("/var/run/secrets/INTTOKEN").toString();
let server = http.createServer((request, response) => {
    if (request.headers["X-Gitlab-Token "] === GL_SECRET) {
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
server.listen(process.env.PORT);
