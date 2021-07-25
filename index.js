import express from "express";
import handlebars from "express-handlebars";
import { Hero } from './models/hero.js'

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded( { extended: true }));
app.use(express.json());

app.engine('hbs', handlebars({defaultLayout: "main.hbs"}));
app.set("view engine", "hbs");

//GET Handlers
app.get('/', (req,res) => {
Hero.find({}).lean()
  .then((Heroes) => {
    res.render('home', { Heroes });
  })
  .catch(err => next(err));
});

app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('About Page');
});

app.get('/detail', (req,res,next) => {
    Hero.findOne({ name:req.query.name }).lean()
        .then((hero) => {
            res.render('details', {result: hero} );
        })
        .catch(err => next(err));
});

app.get('/delete', (req, res,) => {
    Hero.deleteOne({ name:req.query.name }, (err, result) => {
        if (err) return next(err);
        let omit = result.n !== 0;
        Hero.count((err, total) => {
            res.type('text/html');
            res.render('delete', {name: req.query.name, omit: result.n !== 0, total: total } );    
        });
    });
});

//POST Handler
app.post('/detail', (req,res,next) => {
    Hero.findOne({ name:req.body.name }).lean()
        .then((hero) => {
            res.render('details', {result: hero} );
        })
        .catch(err => next(err));
})

//Error Handler
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('Error: Page not found');
});

app.listen(app.get('port'), () => {
});
