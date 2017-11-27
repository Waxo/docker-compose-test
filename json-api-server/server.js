const app = require('express')();
const API = require('json-api');
const mongoose = require('mongoose');
require('dotenv').config();

const APIError = API.types.Error;
mongoose.connect(process.env.DB, {useMongoClient: true});

const models = {
  User: require('./models/user').model,
  Stock: require('./models/stock').model
};

const registryTemplates = {
  users: require('./models/user').registry,
  stocks: require('./models/stock').registry
};

const adapter = new API.dbAdapters.Mongoose(models);
const registry = new API.ResourceTypeRegistry(registryTemplates,
  {dbAdapter: adapter});

const docs = new API.controllers.Documentation(registry, {name: 'Stock API'});
const controller = new API.controllers.API(registry);
const front = new API.httpStrategies.Express(controller, docs);

const apiReqHandler = front.apiRequest.bind(front);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
  res.header('Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

const db = [
  'users',
  'stocks'
];

app.options('*', (req, res) => {
  res.send();
});

app.get('/api', front.docsRequest.bind(front));

app.route(`/api/:type(${db.join('|')})`).get(apiReqHandler).post(apiReqHandler)
  .patch(apiReqHandler);

app.route(`/api/:type(${db.join('|')})/:id`).get(apiReqHandler)
  .patch(apiReqHandler)
  .delete(apiReqHandler);

app.route(`/api/:type(${db.join('|')})/:id/relationships/:relationship`)
  .get(apiReqHandler).post(apiReqHandler).patch(apiReqHandler)
  .delete(apiReqHandler);

app.use((req, res) => {
  front.sendError(new APIError(404, undefined, 'Not Found'), req, res);
});

app.listen(process.env.PORT);
