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

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM recipes WHERE id=$1',
        [id]
      );

      if(!rows[0]) throw new Error(`No recipe with id ${id} found`);

      return new Recipe(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM recipes');

      return rows.map(row => new Recipe(row));
    }

    static async update(id, { title }) {
      const { rows } = await pool.query(
        'UPDATE recipes SET title=$1 WHERE id=$2 RETURNING *',
        [title, id]
      );

      if(!rows[0]) throw new Error(`No recipe with id ${id} found`);

      return new Recipe(rows[0]);
    }
};
