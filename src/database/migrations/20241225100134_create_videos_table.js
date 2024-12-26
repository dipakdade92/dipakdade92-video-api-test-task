exports.up = function(knex) {
    return knex.schema.createTable('videos', function(table) {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('file_path').notNullable();
      table.integer('size').notNullable();
      table.integer('duration').notNullable();
      table.timestamps(true, true);
    });
};
  
exports.down = function(knex) {
return knex.schema.dropTable('videos');
};  