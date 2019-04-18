'use strict';

// node core modules

// 3rd party modules
const _ = require('lodash');
const debug = require('debug')('oniyi:object-transform');

// internal modules
const transformations = require('./built-in-parsers');

const isNotUndefined = v => v !== undefined;

function pickProperties(src, keys) {
  if (!Array.isArray(keys) || keys.length < 1) {
    return {};
  }
  return _.pick(src, keys);
}

function mapProperties(src, map, whitelist, ignoreUndefined) {
  const mapped = {};
  // when map is not an object literal, we have nothing to do
  if (!_.isPlainObject(map)) {
    return mapped;
  }

  _.reduce(
    map,
    (result, targetName, srcName) => {
      if (!targetName) {
        return result;
      }
      if (Array.isArray(whitelist) && !whitelist.includes(targetName)) {
        debug('ignoring map target "%s" because it is not included in "whitelist"', targetName);
        return result;
      }

      const value = _.get(src, srcName);

      if (isNotUndefined(value) || !ignoreUndefined) {
        _.set(result, targetName, value);
        return result;
      }

      return result;
    },
    mapped
  );

  // return the result object with mapped properties
  return mapped;
}

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
      const result = fn(src[parseName]);
      if (isNotUndefined(result)) {
        src[parseName] = result; // eslint-disable-line no-param-reassign
      }
    }
  });
  return src;
}

/**
 * Transforms one object into another
 * @param   {Object}    params                      describing the function arguments
 * @param   {Object}    params.source               source object to be transformed. takes precendence over `params.src`
 * @param   {Object}    [params.src]                alias for `params.source`
 * @param   {Object}    [params.target]             target object to join the transformed source into
 * @param   {String}    [params.method]             name of method to be used when joining results from `pick` and `map`.
 *                                                  Options are: [`merge`, `assign`, `defaults`, `defaultsDeep`].
 *                                                  For details see lodash documentation: https://lodash.com/docs#assign
 * @param   {Object}    [params.map]                key => value map of source properties to be copied to target with a different name
 * @param   {String[]}  [params.whitelist]          list of strings that are allowed as `params.map` values.
 *                                                  This feature is helpful when you transform from one object to a specified schema
 *                                                  and want to restrict target names of `params.map` to the list of schema keys
 * @param   {String[]}  [params.pick]               properties to be picked from source and copied to target with the same name
 * @param   {String[]}  [params.ignoreUndefined]    Should undefined mapped values be accepted?
 * @param   {Object}    [params.parse]              key => value map of target properties to be run through value parsers.
 *                                                  Value can be either of type `String` to reference one of the built-in parsers
 *                                                  [`integer`, `date`, `lowercase`, `uppercase`, `trim`]
 *                                                  or of type `Function` to be called with the original value as single argument.
 * @return  {Object}                                result of transforms applied to params.source
 */
function transform(params) {
  if (!params) {
    throw new Error('params argument is required');
  }

  const source = params.source || params.src;
  if (!source) {
    throw new Error('either `params.source` or `params.src` must be provided');
  }

  const target = params.target || {};

  // compute a function used to join results from the various steps of transformation
  const join = ((methodName = 'assign') => {
    if (!_.isString(methodName)) {
      return _.assign;
    }

    const { [methodName]: method = _.assign } = _;

    return method;
  })(params.method);

  const picked = pickProperties(source, params.pick);
  const mapped = mapProperties(source, params.map, params.whitelist, params.ignoreUndefined);

  const transformResult = join.call(_, target, picked, mapped);

  return parseProperties(transformResult, params.parse);
}

module.exports = transform;
