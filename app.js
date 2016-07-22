'use strict';

const orders_to_json = require('./orders_to_json.js');

/* CSV & JSON Files
===============================================*/
const orders_json = 'json/orders.json';
const orders_csv = 'csv/orders.csv';

/* Order Filters
===============================================*/
const filters = {
  financial_status: 'paid',
  fulfillment_status: null // unfulfilled is represented as null for some reason
}

/* API Variables
===============================================*/
const url = '/admin/orders.json?limit='; // root api call
const order_start_point = 1234; // export starts AFTER this ID, not including it
const orders_per_request = 250; // requests per api call, may reduce for smaller exports. max 250

/* APP
===============================================*/
orders_to_json(url, order_start_point, orders_json, filters, orders_per_request);
