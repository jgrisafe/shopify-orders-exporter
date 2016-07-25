'use strict';

/**************************************
 * FLATTEN                             *
 *=====================================*
 * this function will completely       *
 * flatten an object, prepending the   *
 * keys as it goes deeper              *
 **************************************/

module.exports = function flatten(object, output_object, key_prefix) {

  // if object is not an object, or is falsy, we are as deep as it goes. Write it!
  if (typeof object !== 'object' || !object) {

    output_object[key_prefix] = object;

    // if the object is an array, loop through it and flatten
  } else if (Array.isArray(object)) {

    object.forEach((item) => {
      flatten(item, output_object, key_prefix);
    });

    // else it must be an object
  } else {

    let keys = Object.keys(object);
    keys.forEach((key) => {

      // get the currenty property from object
      let property = object[key];

      // First prepend last prefix to current key, for deep nesting
      let new_prefix;
      if (key_prefix) {
        new_prefix = key_prefix + '_' + key;
      } else {
        new_prefix = key;
      }

      // if property is not an object, add it to the output object
      if (typeof property !== "object") {
        if (key_prefix) {
          output_object[key_prefix + '_' + key] = property;
        } else {
          output_object[key] = property;
        }

        // if property is an array, loop through and recursively call flatten, appending the index to the key  
      } else if (Array.isArray(object[key])) {

        property.forEach((item, index) => {
          flatten(item, output_object, new_prefix);
        });

        // if property is another object and not null, recurzively call flatten
      } else if (typeof property === "object") {

        flatten(property, output_object, new_prefix);

        // if property is undefined or null, add it to the output
      } else if (!object[key]) {
        output_object[key] = property;

        // throw error if it gets here for debugging
      } else {
        throw new Error('there was an error at ' + property);
      }
    });
  }
}
