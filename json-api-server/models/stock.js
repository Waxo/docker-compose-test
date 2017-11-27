const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const maxMemory = values => {
  return values.length <= 10;
};

const stockSchema = new Schema({
  name: {type: String, required: true},
  value: Number,
  previousValues: {
    type: [Number],
    validate: [maxMemory, '{PATH} exceeds the limit of 10']
  },
  user: {type: ObjectId, ref: 'User'}
});

module.exports = {
  schema: stockSchema,
  model: mongoose.model('Stock', stockSchema),
  registry: {
    urlTemplates: {
      self: `${process.env.BASE_URL}/stock/{id}`,
      relationship: `${process.env.BASE_URL}/stock/${process.env.SUFFIX_URL}`
    }
  }
};
