DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS recipes_ingredients;

CREATE TABLE recipes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL
);

CREATE TABLE ingredients (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text TEXT NOT NULL
);

CREATE TABLE recipes_ingredients (
    recipe_id BIGINT REFERENCES recipes(id),
    ingredient_id BIGINT REFERENCES ingredients(id),
    PRIMARY KEY(recipe_id, ingredient_id)
);