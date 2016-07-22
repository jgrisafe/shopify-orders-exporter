# shopify-orders-export

Script to export orders from Shopify with all available API data.

Run npm install to begin, you'll also need a shopify_config.js file in this format:

```
module.exports = {
    shop: 'MYSHOP.myshopify.com ',
    shopify_api_key: 'xxxx', // Your API key 
    access_token: 'xxxx', // Your API password
    verbose: false // if you don't want to see headers on every call
  }
```
Go into the app.js file a set the variables for starting order point (by id, not order number) and any 
filters you might want, defaults are paid, unfullfilled orders. You can get reference to the Shopify order API
here: https://help.shopify.com/api/reference/order

You can find the order id in shopify at the end of the order url, like so:
```https://MYSTORE.myshopify.com/admin/orders/[order id]```

set these variables in app.js:
```
/* API Variables
===============================================*/
const url = '/admin/orders.json?limit='; // root api call
const order_start_point = 1234; // export starts AFTER this ID, not including it
const orders_per_request = 250; // requests per api call, may reduce for smaller exports. max 250
```

First run ```node app``` to create the json file.

Last run ```node json_to_csv``` to generate the csv file. Then you're done!
