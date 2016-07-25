'use strict';

const shopifyAPI = require('shopify-node-api');
const fs = require('fs');
const waterfall = require('async/waterfall');
const each = require('async/each');
const flatten = require('flat'); // node package for flatten
// const flatten = require('./flatten.js'); // previous script for flatten

/* SHOPIFY SETUP
===============================================*/
const config = require('./shopify_config');
const Shopify = new shopifyAPI(config);

/* API LIMIT
===============================================*/
function getApiLimit(headers) {
  var api_limit = headers['http_x_shopify_shop_api_call_limit'];
  console.log(api_limit); // "1/40"
}

/* FILE FUNCTIONS
===============================================*/

const startJsonFile = (file, callback) => {
  let stream;
  try {
    stream = fs.createWriteStream(file);
    stream.write('[');
    callback(null, stream);
  } catch (err) {
    console.log(err);
    callback(err);
  }
};

const filterOrders = (orders, filters, callback) => {
  let filtered_orders = orders.filter((order) => {
    let passed_filters = true;
    for(let filter in filters) {
      if(order[filter] != filters[filter]) {
        console.log("filtered order: " + order.name)
        return false;
      }
    }
    return true;
  });
  callback(null, filtered_orders);
}

const checkAPI = (headers) => {
  var api_limit = headers['http_x_shopify_shop_api_call_limit'];
  console.log( api_limit );
}

const getOrders = (url, callback) => {
  let data;
  Shopify.get(url, (err, data, headers) => {
    checkAPI(headers);
    if(err) {console.log(err);}
    callback(err, data.orders);
  });
}

const orders_to_line_items = (orders, callback) => {

 let line_items = orders.reduce((line_items_array, order, orderIndex) => {
    let line_items = order.line_items;
    line_items.forEach((line_item, index) => {
      let single_item_order = {};
      if (index === 0) {
        Object.assign(single_item_order, order);
        delete single_item_order.line_items;
      } else {
        single_item_order.name = order.name;
        single_item_order.id = order.id;
      }
      single_item_order.line_item = {};
      Object.assign(single_item_order.line_item, order.line_items[index]);
      line_items_array.push(single_item_order);
    });
    return line_items_array;
  }, []);

  callback(null, line_items);
}

const flattenOrders = (orders, callback) => {
  let flattened_orders = orders.map((order) => {
    let flat_order = {};
    return flatten(order, {delimiter: '_'});
    // return flat_order;
  });
  callback(null, flattened_orders);
}

const write_order_chunk = (stream, orders, is_first_order, callback) => {
  let last_order_id;
  each(orders, (order, each_callback) => {
    last_order_id = order.id;
    try {
      if(is_first_order) {
        stream.write(JSON.stringify(order));
      } else {
        stream.write(',' + JSON.stringify(order));
      }
      is_first_order = false;
      each_callback(null);
    } catch (err) {
      console.log(err);
      each_callback(err);
    }
  }, (err) => {
    callback(err, last_order_id);
  });
}

function write_orders(url, start_id, output_file, chunk_size, filters, is_first_order, stream) {
  let full_url = url + chunk_size + '&since_id=' + start_id;
  let current_chunk_size;

  waterfall([
    // write open tag to file
    function(callback) {
      if (stream) {
        callback(null, stream);
        is_first_order = false;
      } else {
        startJsonFile(output_file, (err, stream) => {
          callback(err, stream);
        });
      }
    },
    // get chunk of orders from shopify
    function(stream, callback) {
      getOrders(full_url, (err, orders) => {
        current_chunk_size = orders.length;
        callback(err, stream, orders)
      });
    },
    // filter the orders
    function(stream, orders, callback) {
      let filtered_orders = filterOrders(orders, filters, (err, orders) => {
        callback(null, stream, orders);
      });
    },
    // separate orders into line items
    function(stream, orders, callback) {
      orders_to_line_items(orders, (err, orders) => {
        callback(null, stream, orders);
      });
    },
    // flatten the orders
    function(stream, line_items, callback) {
      flattenOrders(line_items, (err, orders) => {
        callback(null, stream, orders);
      });
    },
    // write the orders to file
    function(stream, flattened_orders, callback) {
       write_order_chunk(stream, flattened_orders, is_first_order, (err, last_order_id) => {
        callback(err, stream, last_order_id);
       });
    },
    function(stream, last_order_id, callback) {
      if(last_order_id) {
        callback(null, stream, last_order_id);
      } else {
        callback(err)
      }
    }
  ], (err, stream, last_order_id) => {

    if(err) {
      throw new Error(err);
    }

    if(current_chunk_size == chunk_size) {
      console.log("writing " + chunk_size + " after order id: " + last_order_id);
      write_orders(url, last_order_id, output_file, chunk_size, filters, false, stream);
    } else {
      console.log("wrote last " + current_chunk_size + " after order id: " + last_order_id);
      stream.end(']');
      return;
    }
  });
}

module.exports = (url, start_id, output_file, filters, orders_per_request) => {
  write_orders(url, start_id, output_file, orders_per_request, filters, true);
}













