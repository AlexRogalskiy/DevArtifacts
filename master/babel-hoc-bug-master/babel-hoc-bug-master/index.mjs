import fsp from 'mz/fs';
import http from 'http';

http.createServer(async (req, res) => {
    try {
        const path = req.url.match('.js') ? './dist/myApp/index.js' : './dist/myApp/index.html';
        const file = await fsp.readFile(path, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(file, 'utf-8');
    }
    catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error\n${error.message}\n${error.stack}`);
    }
}).listen(8080);