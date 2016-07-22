'use strict';

const json2csv = require('json2csv');
const fs = require('fs');
const jsonfile = require('jsonfile');
const fields = require('./fields.js');

/* CSV & JSON Files
===============================================*/
const orders_json = 'json/orders.json'
const orders_csv = 'csv/orders.csv'

jsonfile.readFile(orders_json, function(err, orders) {
  const csv = {
    data: orders,
    fields: fields
  };
  try {
    var result = json2csv(csv);
    fs.writeFile(orders_csv, result, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
  } catch (err) {
    console.error(err);
  }
});