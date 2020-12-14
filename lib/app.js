const express = require('express');
const Recipe = require('./models/Recipe');
const app = express();

app.use(express.json());

//endpoints for recipes
app.post('/recipes', (req, res, next) => {
  Recipe
    .insert(req.body)
    .then(recipe => res.send(recipe))
    .catch(next);
});

app.get('/recipes/:id', (req, res, next) => {
  Recipe
    .findById(req.params.id)
    .then(recipe => res.send(recipe))
    .catch(next);
});

module.exports = app;
