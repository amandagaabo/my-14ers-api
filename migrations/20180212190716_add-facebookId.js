exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table.string('facebookId').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('facebookId');
  });
};
