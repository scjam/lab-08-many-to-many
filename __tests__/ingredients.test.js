const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Ingredient = require('../lib/models/Ingredient');

describe('ingredients routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new ingredient via POST', async() => {
    const response = await request(app)
      .post('/ingredients')
      .send({
        text: 'Chickpeas'
      });

    expect(response.body).toEqual({
      id: '1',
      text: 'Chickpeas'
    });
  });

  it('finds an ingredient by id via GET', async() => {
    const ingredient = await Ingredient.insert({
      text: 'Flour'
    });

    const response = await request(app)
      .get(`/ingredients/${ingredient.id}`);

    expect(response.body).toEqual(ingredient);
  });

  it('finds all ingredients via GET', async() => {
    const ingredients = await Promise.all([
      { text: 'Parsley' },
      { text: 'Salt' },
      { text: 'Lemon Juice' }
    ].map(ingredient => Ingredient.insert(ingredient)));

    const response = await request(app)
      .get('/ingredients');

    expect(response.body).toEqual(expect.arrayContaining(ingredients));
    expect(response.body).toHaveLength(ingredients.length);
  });

  it('updates an ingredient via PUT', async() => {
    const ingredient = await Ingredient.insert({
      text: 'Cumin'
    });

    const response = await request(app)
      .put(`/ingredients/${ingredient.id}`)
      .send({
        text: 'Coriander'
      });

    expect(response.body).toEqual({
      id: ingredient.id,
      text: 'Coriander'
    });
  });
});
