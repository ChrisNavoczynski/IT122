import http from "http";
import * as data from './data.js';
import { parse } from "querystring";

http.createServer((req, res) => {
    let url = req.url.split("?");
    let query = parse(url[1]);
    let path = url[0].toLowerCase();

    switch(path) {
        case '/':
            let array = data.getAll();
            res.writeHead(200, {'Content-Type': 'text/plain'});
            let heroList = (array) ? JSON.stringify(array, null, 2) : "Not found";
            res.end('List of heroes: ' + "\n" + heroList);
            break;
        
        case '/about':
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('About Page');
            break;

        case '/detail':
            let item = data.getItem(query.name);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            let result = (item) ? JSON.stringify(item, null, 2) : "Not found";
            res.end('Found hero(es): ' + query.name + "\n" + result);
            break; 
        
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            console.log(query);
            res.end("ERROR Page not found");
            break;
    }
})
.listen(process.env.PORT || 3000);
