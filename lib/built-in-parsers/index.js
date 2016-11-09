const _ = require('lodash');
const logger = require('oniyi-logger')('oniyi:object-transform:parsers');

module.exports = {
  'does-not-exist': (val, requestedParserName) => {
    logger.error('requested parser name "%s" is invalid', requestedParserName);
    return val;
  },
  integer: (val, radix = 10) => parseInt(val, radix),
  date: val => new Date(val),
  dateParse: val => Date.parse(val),
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
  trim: (val, chars) => _.trim(val, chars),
};
