const { Model } = require('objection');

class Peak extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'peaks';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'uuid',
        'userId',
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
        uuid: { type: 'uuid' },
        userId: { type: 'uuid' },
        peakName: { type: 'string', minLength: 1 },
        dateClimbed: { type: 'date' },
        notes: { type: 'string' },
        imgSrc: { type: 'string' },
        range: { type: 'string' },
        rank: { type: 'string' },
        elevation: { type: 'integer' },
        latitude: { type: 'decimal' },
        longitude: { type: 'decimal' },
      }
    };
  }

  // static get relationMappings() {
  //   return {
  //     user: {
  //       relation: Model.BelongsToOneRelation,
  //       // The related model. This can be either a Model subclass constructor or an
  //       // absolute file path to a module that exports one.
  //       modelClass: require('./User'),
  //       join: {
  //         from: 'peak.userId',
  //         to: 'user.id'
  //       }
  //     }
  //   };
  // }
}

module.exports = Peak;
