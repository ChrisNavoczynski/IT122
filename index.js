//Node Setup

import http from "http";
http.createServer((req, res) => {
    var path = req.url.toLowerCase();

    switch(path) {
        case '/':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Home Page');
            break;
        
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('About Page');
            break;
        
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end("ERROR Page not found");
            break;
    }
})
.listen(process.env.PORT || 3000);
