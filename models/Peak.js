const { Model } = require('objection');

class Peak extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'Peaks';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'peakName',
        'dateClimbed',
        'imgSrc',
        'range',
        'rank',
        'elevation',
        'latitude',
        'longitude'
      ],

      properties: {
        id: { type: 'integer' },
        userId: { type: ['integer', 'null'] },
        peakName: { type: 'string', minLength: 1 },
        dateClimbed: { type: 'date' },
        notes: { type: 'string' },
        imgSrc: { type: 'string' },
        range: { type: 'string' },
        rank: { type: 'integer' },
        elevation: { type: 'integer' },
        latitude: { type: 'float' },
        longitude: { type: 'float' },
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: User,
        join: {
          from: 'Peak.ownerId',
          to: 'User.id'
        }
      }
    };
  }
}

module.exports = Peak;
