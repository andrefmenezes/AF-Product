//Base-lib
const md5 = require('md5');

let config = {};

if (process.env.VIW_ENV == 'PRODUCTION') {
  //config = require('./config-prod.json');
} else {
  config = require('./config-dev.json');
}

exports.security = {
  encryptPassword: (originalPassword) => {
    return md5(originalPassword);
  },
  matchPassword: (originalPassword, encryptedPassword) => {
    return md5(originalPassword) == encryptedPassword;
  },
};
