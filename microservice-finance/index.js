const yahooFinance = require('yahoo-finance');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const {createOrUpdateStock} = require('./app/controllers/stocks');

mongoose.connect(process.env.DB, {useMongoClient: true});

const stocks = [
  'BNP.PA',
  'FP.PA',

];

const getValue = async symbol => {
  const stock = await yahooFinance.quote({
    symbol,
    modules: ['financialData']
  });
  return stock.financialData.currentPrice;
};

const main = async () => {
  const valuesPromises = stocks.map(a => getValue(a));
  const results = await Promise.all(valuesPromises);
  const formattedResults = stocks.map((a, idx) => {
    return {[a]: results[idx]};
  });

  stocks.map((a, idx) => {
    createOrUpdateStock(a, results[idx]);
  });

  console.log(formattedResults);
};

setInterval(main, 30000);
