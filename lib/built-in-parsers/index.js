const _ = require('lodash');
const logger = require('../logger');

module.exports = {
  'does-not-exist': (val, requestedParserName) => {
    logger.error('requested parser name "%s" is invalid', requestedParserName);
    return val;
  },
  integer: (val, radix) => {
    return parseInt(val, radix || 10);
  },
  date: (val, useParse) => {
    if (useParse) {
      return Date.parse(val);
    }
    return new Date(val);
  },
  lowercase: (val) => {
    if (!typeof val === String) {
      return val;
    }
    return val.toLowerCase();
  },
  uppercase: (val) => {
    if (!typeof val === String) {
      return val;
    }
    return val.toUpperCase();
  },
  trim: (val, chars) => {
    return _.trim(val, chars);
  },
};
