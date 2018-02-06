exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema
      .createTable('users', (table) => {
        table.increments('id').primary();

        table.uuid('uuid').notNull();
        table.string('email').notNull();
        table.string('password').notNull();
      })

      .createTable('peaks', (table) => {
        table.increments('id').primary();

        table.uuid('uuid').notNull();
        table.uuid('userId').notNull();
        table.string('peakName').notNull();
        table.date('dateClimbed').notNull();
        table.string('notes').nullable();
        table.string('imgSrc').notNull();
        table.string('range').notNull();
        table.string('rank').notNull();
        table.integer('elevation').notNull();
        table.decimal('latitude', 12, 8).notNull();
        table.decimal('longitude', 12, 8).notNull();
      })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema
      .dropTableIfExists('peaks')
      .dropTableIfExists('users')
  ]);
};
