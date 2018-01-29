const { Model } = require('objection');

class Peak extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'Peak';
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['peakName', 'dateClimbed'],

      properties: {
        id: { type: 'integer' },
        userId: { type: ['integer', 'null'] },
        peakName: { type: 'string', minLength: 1 },
        dateClimbed: { type: 'string' },
        notes: { type: 'string' }
      }
    };
  }
}

module.exports = Peak;
