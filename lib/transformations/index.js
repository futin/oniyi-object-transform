module.exports = {
  integer: (val) => {
    return parseInt(val, 10);
  },
  date: (val) => {
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
};
