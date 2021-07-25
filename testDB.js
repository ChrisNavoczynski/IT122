import { Hero } from "./models/hero.js";

// return all records
Hero.find({}).lean()
  .then((heroes) => {
    console.log(heroes);
  })
  .catch(err => next(err));