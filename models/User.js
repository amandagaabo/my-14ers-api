const { Model } = require('objection');

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'Users';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 8, maxLength: 65 }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    const Peak = require('./Peak');

    return {
      peaks: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Peak,
        join: {
          from: 'User.id',
          to: 'Peak.ownerId'
        }
      },
    };
  }
}

module.exports = User;
