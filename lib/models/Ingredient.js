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

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM ingredients WHERE id=$1',
        [id]
      );

      if(!rows[0]) throw new Error(`No ingredient with id ${id} found`);

      return new Ingredient(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query('SELECT * from ingredients');

      return rows.map(row => new Ingredient(row));
    }

    static async update(id, { text }) {
      const { rows } = await pool.query(
        'UPDATE ingredients SET text=$1 WHERE id=$2 RETURNING *',
        [text, id]
      );

      if(!rows[0]) throw new Error(`No ingredient with id ${id} found`);

      return new Ingredient(rows[0]);
    }
};
