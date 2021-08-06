import express from "express";
import handlebars from "express-handlebars";
import { Hero } from './models/hero.js'
import cors from 'cors';

const app = express();

app.set("port", process.env.PORT || 3000);
app.use(express.static('./public'));
app.use(express.urlencoded( { extended: true }));
app.use(express.json());
app.use('/api', cors());

app.engine('hbs', handlebars({defaultLayout: "main.hbs"}));
app.set("view engine", "hbs");

//GET Handlers
app.get('/', (req,res,next) => {
    Hero.find({}).lean()
      .then((heroes) => {
        res.render('home', { heroes: JSON.stringify(heroes)});
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
        Hero.countDocuments((err, total) => {
            res.type('text/html');
            res.render('delete', {name: req.query.name, omit: result.n !== 0, total: total } );    
        });
    });
});

//api's
app.get('/api/v1/heroes', (req, res, next) => {
    Hero.find((error, heroes) => {
        if (error) {
            next(error);
        } else if (heroes) {
            res.json(heroes);
            console.log(heroes);
        } else {
            res
                .status(404)
                .send({ error: "Cannot Find Heroes" });
        }
    });
});

app.get('/api/v1/hero/:name', (req, res, next) => {
    let name = req.params.name;
    console.log(name);
    Hero.findOne({name: name}, (error, hero) => {
        if (error) {
            next(error);
        } else if (hero) {
            res.json(hero);
        } else {
            res
                .status(404)
                .send({ error: "Cannot locate this Hero" });
        }
    });
});

app.get('/api/v1/delete/:_id', (req, res, next) => {
    Hero.deleteOne({"_id":req.params._id}, (error, hero) => {
        if (error) {
            next(error);
        } else if (hero) {
            res.json({ "deleted": hero });
        } else {
            res
                .status(404)
                .send({ error: "Cannot locate this Hero" });
        }
    });
});

app.get('/api/v1/add/:name/:class/:align/:level', (req, res, next) => {
    let name = req.params.name;
    Hero.updateOne({ name: name }, {name: name, class: req.params.class, 
    align: req.params.align, level: req.params.level }, {upsert: true}, (error, result) => {
        if (error) return next(error)
        res.json({updated: result.nModified, success: "This Hero has been added" });
    });
});

//POST Handlers
app.post('api/v1/add/', (req, res, next) => {
    console.log(req.body)
    if (!req.body._id) {
        let hero = new Hero({name: req.body.name, class: req.body.class,
            align: req.body.align, level: req.body.level});
        hero.save((error, newHero) => {
            if (error)  { 
                next(error);
            } else if (newHero) {
                console.log(newHero) 
                res.json({ updated: 0, _id: newHero._id });
            } else {
                res 
                .status(404)
                .send({ error: "Unable to Add" });
            }  
        });
    } else {
        Hero.updateOne({_id: req.body._id}, {name: req.body.name, class: req.body.class,
            align: req.body.align, level: req.body.level}, (error, result) => {
                if (error) {
                    next(error);
                } else if (result) {
                    res.json({ updated: result.nModified, success: "This Hero has updated" }, {su});
                } else {
                    res 
                    .status(404)
                    .send({ error: "Unable to update" });
                }
            });
    }
});

app.post('/detail', (req, res, next) => {
    Hero.findOne({ name:req.body.name }).lean()
        .then((hero) => {
            res.render('details', {result: hero} );
        })
        .catch(err => next(err));
});

//Error Handler
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('Error: This Page is not found');
});

app.listen(app.get('port'), () => {
});
