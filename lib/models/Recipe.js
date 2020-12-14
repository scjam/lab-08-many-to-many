const pool = require('../utils/pool');

module.exports = class Recipe {
    id;
    title;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
    }

    static async insert({ title }) {
      const { rows } = await pool.query(
        'INSERT INTO recipes (title) VALUES ($1) RETURNING *',
        [title]
      );

      return new Recipe(rows[0]);
    }
};
