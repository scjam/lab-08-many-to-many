const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const Ingredient = require('../lib/models/Ingredient');

describe('recipes routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new recipe via POST', async() => {
    const response = await request(app)
      .post('/recipes')
      .send({
        title: 'No Knead Bread'
      });

    expect(response.body).toEqual({
      id: '1',
      title: 'No Knead Bread'
    });
  });

  it('finds a recipe and ingredients by id via GET', async() => {
    await Promise.all([
      { text: 'Onion' },
      { text: 'Olive Oil' },
      { text: 'Butter' }
    ].map(ingredient => Ingredient.insert(ingredient)));
    
    const recipe = await Recipe.insert({
      title: 'Fish Tacos',
      ingredients: ['Onion', 'Olive Oil']
    });

    const response = await request(app)
      .get(`/recipes/${recipe.id}`);

    expect(response.body).toEqual({
      ...recipe,
      ingredients: ['Onion', 'Olive Oil']
    });
  });

  it('finds all recipes via GET', async() => {
    const recipes = await Promise.all([
      { title: 'PB&Onion Sandwich' },
      { title: 'Beef Wellington' },
      { title: 'Chicken Soup' }
    ].map(recipe => Recipe.insert(recipe)));

    const response = await request(app)
      .get('/recipes');

    expect(response.body).toEqual(expect.arrayContaining(recipes));
    expect(response.body).toHaveLength(recipes.length);
  });

  it('updates a recipe via PUT', async() => {
    const recipe = await Recipe.insert({
      title: 'Curry Ramen'
    });

    const response = await request(app)
      .put(`/recipes/${recipe.id}`)
      .send({
        title: 'Peanut Butter and Ramen Noodles'
      });

    expect(response.body).toEqual({
      id: recipe.id,
      title: 'Peanut Butter and Ramen Noodles'
    });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.insert({
      title: 'Mayonnaise'
    });

    const response = await request(app)
      .delete(`/recipes/${recipe.id}`);

    expect(response.body).toEqual(recipe);
  });
});
