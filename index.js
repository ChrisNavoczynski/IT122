import express from "express";
import handlebars from "express-handlebars";
import * as data from './data.js';
//import { parse } from "querystring";

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded( { extended: true }));
app.use(express.json());

app.engine('hbs', handlebars({defaultLayout: "main.hbs"}));
app.set("view engine", "hbs");

//GET Handlers
app.get('/', (req, res) => {
    res.render('home', {Heroes: data.getAll()});
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('About Page');
});

app.get('/detail', (req, res) => {
    let result = data.getItem(req.query.name);
    res.render('details', {
        name: req.query.name,
        result
    });
});

//POST Handler
app.post('/detail', (req, res) => {
    let item = data.getItem(req.body.name);
    res.render("details", {name: req.body.name, result: item, Heroes: data.getAll()});
});

//Error Handler
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('Error: Page not found');
});

app.listen(app.get('port'), () => {
});
