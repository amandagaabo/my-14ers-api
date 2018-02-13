exports.up = function (knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('facebookId').nullable();
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('facebookId');
  });
};
