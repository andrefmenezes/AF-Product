const usersRepository = require("./repositories/UsersRepository");
const sessionRepository = require("./repositories/SessionRepository");

var unauthorized = function (req, res, next) {
  res.status(401);
  res.send();
};

var requireLogin = function (req, res, next) {
  if (req.headers.authorization && req.headers.authorization != null) {
    let sessionId = req.headers.authorization;
    req.session = {}; 
    
    sessionRepository.getById(sessionId).then((session) => {
      if (session && session.userId) {
        usersRepository.getById(session.userId).then((user) => {
          if (user) {
            req.session.user = user;
            next();
          } else {
            req.session.user = null;
            unauthorized(req, res);
          }
        });
      } else {
        req.session.user = null;
        unauthorized(req, res);
      }
    });
  } else {
    req.session.user = null;
    unauthorized(req, res);
  }
};

module.exports = { unauthorized, requireLogin};