# shopify-orders-export

Script to export orders from Shopify will all available API data...more to come!

Run npm install to begin, you'll also need a shopify_config.js file in this format:

```
module.exports = {
    shop: 'MYSHOP.myshopify.com ',
    shopify_api_key: 'xxxx', // Your API key 
    access_token: 'xxxx', // Your API password
    verbose: false // if you don't want to see headers on every call
  }
```