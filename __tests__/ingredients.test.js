const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
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
});
