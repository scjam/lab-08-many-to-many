const pool = require('../utils/pool');
const Recipe = require('./Recipe');

module.exports = class Ingredient {
    id;
    text;

    constructor(row) {
      this.id = row.id;
      this.text = row.text;
    }
    
    static async insert({ text }) {
      const { rows } = await pool.query(
        'INSERT INTO ingredients (text) VALUES ($1) RETURNING *',
        [text]
      );

      return new Ingredient(rows[0]);
    }
};
