exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema
      .createTable('Users', (table) => {
        table.increments('id').primary();

        table.string('email').notNull();
        table.string('password').notNull();
      })

      .createTable('Peaks', (table) => {
        table.increments('id').primary();

        table.integer('userId').notNull();
        table.string('peakName').notNull();
        table.date('dateClimbed').notNull();
        table.string('notes').nullable();
        table.string('imgSrc').notNull();
        table.string('range').notNull();
        table.integer('rank').notNull();
        table.integer('elevation').notNull();
        table.float('latitude').notNull();
        table.float('longitude').notNull();
      })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema
      .dropTableIfExists('Peaks')
      .dropTableIfExists('Users')
  ]);
};
