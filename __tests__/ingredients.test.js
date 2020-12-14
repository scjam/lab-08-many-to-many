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
});
