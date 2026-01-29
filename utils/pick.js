/**
 * Create an object composed of the picked object properties
 * @param {Object} object - The source object
 * @param {Array} keys - The property names to pick
 * @returns {Object} The new object with picked properties
 */
const pick = (object, keys) => {
  if (!object || typeof object !== 'object') {
    return {};
  }

  return keys.reduce((result, key) => {
    if (object.hasOwnProperty && object.hasOwnProperty(key) && object[key] !== undefined) {
      result[key] = object[key];
    }
    return result;
  }, {});
};

module.exports = pick;
