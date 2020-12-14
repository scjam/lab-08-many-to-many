const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const pool = require('../lib/utils/pool');

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

  it('finds a recipe by id via GET', async() => {
    const recipe = await Recipe.insert({
      title: 'Fish Tacos'
    });

    const response = await request(app)
      .get(`/recipes/${recipe.id}`);

    expect(response.body).toEqual(recipe);
  });
});
