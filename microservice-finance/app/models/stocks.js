const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const maxMemory = values => {
  return values.length <= 10;
};

const stockSchema = new Schema({
  name: String,
  value: Number,
  previousValues: {
    type: [Number],
    validate: [maxMemory, '{PATH} exceeds the limit of 10']
  }
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = {
  Stock
};
