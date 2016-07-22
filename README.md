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

First run ```node app``` to create the json file.

Last run ```node json_to_csv``` to generate the csv file. Then you're done!
