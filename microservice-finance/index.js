#!/usr/bin/env node
const yahooFinance = require('yahoo-finance');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const {createOrUpdateStock} = require('./app/controllers/stocks');

const dbURL = process.env.DB || 'mongodb://127.0.0.1:27017/dev-yahoo-finance';

mongoose.connect(dbURL, {useMongoClient: true});

const stocks = [
  'BNP.PA',
  'FP.PA'
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

  stocks.forEach((a, idx) => {
    createOrUpdateStock(a, results[idx]);
  });

  console.log(formattedResults);
};

setInterval(main, 30000);
