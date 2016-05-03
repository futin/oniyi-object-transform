'use strict';

const _ = require('lodash');

function pickProperties(src, keys) {
  if (!Array.isArray(keys)) {
    return src;
  }
  return _.pick(src, keys);
}

function mapProperties(src, map, whitelist) {
  const mapped = {};
  // when map isn't an object literal, we have nothing to do
  if (!_.isPlainObject(map)) {
    return mapped;
  }

  // when whitelist isn't an array, we have nothing to do
  if (!Array.isArray(whitelist)) {
    return mapped;
  }

  Object
    .keys(map)
    .reduce((result, srcName) => {
      const targetName = map[srcName];
      if (!targetName) {
        return result;
      }
      if (whitelist.indexOf(targetName) < 0) {
        return result;
      }
      if (!src[srcName]) {
        return result;
      }
      /* eslint-disable no-param-reassign */
      result[targetName] = src[srcName];
      /* eslint-enable no-param-reassign */
      return result;
    }, mapped);

  // return the result object with mapped properties
  return mapped;
}

const transformations = require('./transformations');

function parseProperties(src, parse) {
  if (!parse || Object.keys(parse).length < 1) {
    return src;
  }

  Object.keys(parse).forEach((parseName) => {
    let fn = parse[parseName];
    if (typeof fn === 'string') {
      fn = transformations[fn.toLowerCase()];
    }
    if (typeof fn === 'function') {
      /* eslint-disable no-param-reassign */
      src[parseName] = fn(src[parseName], src);
      /* eslint-enable no-param-reassign */
    }
  });
  return src;
}

/**
 * Transforms one object into another
 * @param   {Object}    params describing the function arguments
 * @param   {Object}    params.source source object to be transformed
 * @param   {Object}    params.map key => value map of source properties to be copied to target with a different name
 * @param   {String[]}  params.whitelist properties allowed to be copied from source or mapped to
 * @return  {Object}    result of transforms applied to params.source
 */
module.exports = function transform(params) {
  if (!params || !params.source) {
    return {};
  }

  // return empty object if whitelist is not an array or has less than 1 entry
  if (!params.whitelist || !Array.isArray(params.whitelist) || params.whitelist.length < 1) {
    return {};
  }

  const picked = pickProperties(params.source, params.whitelist);
  const mapped = mapProperties(params.source, params.map, params.whitelist);

  const transformResult = _.assign({}, picked, mapped);

  return parseProperties(transformResult, params.parse);
};
