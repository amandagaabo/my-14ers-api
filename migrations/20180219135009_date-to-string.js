exports.up = function (knex) {
  return knex.schema.alterTable('peaks', function (table) {
    table.string('dateClimbed').notNull().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('peaks', function (table) {
    table.date('dateClimbed').notNull().alter();
  });
};
