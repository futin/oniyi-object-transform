'use strict';

// node core modules

// 3rd party modules
const _ = require('lodash');
const debug = require('debug')('oniyi:object-transform:parsers');

// internal modules

module.exports = {
  'does-not-exist': (val, requestedParserName) => {
    debug('requested parser name "%s" is invalid', requestedParserName);
    return val;
  },
  integer: (val, radix = 10) => parseInt(val, radix),
  date: val => new Date(val),
  dateParse: val => Date.parse(val),
  lowercase: val => (val && _.isString(val) && val.toLowerCase()) || val,
  uppercase: val => (val && _.isString(val) && val.toUpperCase()) || val,
  trim: (val, chars) => _.trim(val, chars),
};
