const {Stock} = require('../models/stocks');

const createOrUpdateStock = (name, value) => {
  Stock.findOne({name})
    .then(stock => {
      if (stock) {
        stock.previousValues.push(stock.value);
        stock.previousValues.splice(0, stock.previousValues.length - 10);
        stock.value = value;
        return stock.save();
      }
      return new Stock({name, value}).save();
    })
    .catch(err => console.log(err));
};

module.exports = {createOrUpdateStock};
