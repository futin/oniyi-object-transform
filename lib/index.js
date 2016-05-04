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
  // when map is not an object literal, we have nothing to do
  if (!_.isPlainObject(map)) {
    return mapped;
  }

  Object
    .keys(map)
    .reduce((result, srcName) => {
      const targetName = map[srcName];
      if (!targetName) {
        return result;
      }
      if (Array.isArray(whitelist) && whitelist.indexOf(targetName) < 0) {
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

const transformations = require('./built-in-parsers');

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
 * @param   {Object}    params.source       source object to be transformed. takes precendence over `params.src`
 * @param   {Object}    params.src          alias for `params.source`
 * @param   {Object}    [params.map]        key => value map of source properties to be copied to target with a different name
 * @param   {String[]}  [params.whitelist]  list of strings that are allowed as `params.map` values.
 *                                          This feature is helpful when you transform from one object to a specified schema
 *                                          and want to restrict target names of `params.map` to the list of schema keys
 * @param   {String[]}  [params.pick]       properties to be picked from source and copied to target with the same name
 * @param   {Object}    [params.parse]      key => value map of target properties to be run through value parsers.
 *                                          Value can be either of type `String` to reference one of the built-in parsers
 *                                          [`integer`, `date`, `lowercase`, `uppercase`, `trim`]
 *                                          or of type `Function` to be called with the original value as single argument.
 * @return  {Object}    result of transforms applied to params.source
 */
module.exports = function transform(params) {
  if (!params) {
    throw new Error('params argument is required');
  }

  const source = params.source || params.src;
  if (!source) {
    throw new Error('either `params.source` or `params.src` must be provided');
  }

  const picked = pickProperties(source, params.pick);
  const mapped = mapProperties(source, params.map, params.whitelist);

  const transformResult = _.assign({}, picked, mapped);

  return parseProperties(transformResult, params.parse);
};
