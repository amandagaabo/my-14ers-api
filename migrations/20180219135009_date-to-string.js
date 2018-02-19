exports.up = function (knex, Promise) {
  return knex.schema.alterTable('peaks', function (table) {
    table.string('dateClimbed').notNull().alter();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.alterTable('peaks', function (table) {
    table.date('dateClimbed').notNull().alter();
  });
};
