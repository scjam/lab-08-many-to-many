const pool = require('../utils/pool');

module.exports = class Recipe {
    id;
    title;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
    }

    static async insert({ title, ingredients = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO recipes (title) VALUES ($1) RETURNING *',
        [title]
      );

      await pool.query(
        `INSERT INTO recipes_ingredients (recipe_id, ingredient_id)
        SELECT ${rows[0].id}, id FROM ingredients WHERE text = ANY($1::text[])
        `,
        [ingredients]
      );

      return new Recipe(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT 
          recipes.*,
          array_agg(ingredients.text) AS ingredients
        FROM recipes_ingredients
        JOIN recipes
        ON recipes_ingredients.recipe_id = recipes.id
        JOIN ingredients
        ON recipes_ingredients.ingredient_id = ingredients.id
        WHERE recipes.id=$1
        GROUP BY recipes.id
        `,
        [id]
      );

      if(!rows[0]) throw new Error(`No recipe with id ${id} found`);

      return {
        ...new Recipe(rows[0]),
        ingredients: rows[0].ingredients
      };
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

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM recipes WHERE id=$1 RETURNING *',
        [id]
      );

      return new Recipe(rows[0]);
    }
};
