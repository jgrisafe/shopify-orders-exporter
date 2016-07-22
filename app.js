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
const order_start_point = 1300406531; // beginning of preorders
// const order_start_point = 3346547971; // test from recent order

/* APP
===============================================*/
orders_to_json(url, order_start_point, orders_json, filters);
