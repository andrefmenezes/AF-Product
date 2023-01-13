const usersRepository = require('../repositories/UsersRepository');
const sessionRepository = require('../repositories/SessionRepository');
const baseLib = require('../base-lib');
const dateTime = require('node-datetime');

const getSendableUser = (user) => {
  let sendableUser = {
    userId: user._id,
    email: user.email,
    username: user.username,
  };
  return sendableUser;
};

module.exports = class UsersController {
  static async auth(req, res) {
    try {
      if (
        !req.body ||
        !req.body.signinData ||
        !req.body.signinData.username ||
        !req.body.signinData.password
      ) {
        res.status(400).json({ message: 'Insira seus dados' });
      }
     
      await usersRepository
        .getByUsername(req.body.signinData.username)
        .then((existingUser) => {
          if (!existingUser) {
           return res.status(404).json({ message: 'Usuário/senha inválido(a)!' });
          } else if (
            !baseLib.security.matchPassword(
              req.body.signinData.password,
              existingUser.password
            )
          ) {
            return res.status(404).json({ message: 'Usuário/senha inválido(a)!' });
          } else {
            let newSession = {
              userId: existingUser._id.toString(),
            };
            sessionRepository.insert(newSession).then(() => {
              res.send({
                session: newSession,
                user: getSendableUser(existingUser),
              });
            });
          }
        });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async removeAuth(req, res) {
    try {
      let tempSessionId = req.headers['base-auth'];
      if (
        tempSessionId &&
        (tempSessionId.length == 12 || tempSessionId.length == 24)
      ) {
        sessionRepository.removeById(tempSessionId).then(() => {
          res.send();
        });
      } else {
        res.send();
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async getAll(req, res) {
    try {
      const users = await usersRepository.getAll();
      if (!users) {
        res.status(404).json('There are no users yet!');
      }
      res.send(users);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async insert(req, res) {
    try {
      if (
        !req.body ||
        !req.body.email ||
        !req.body.password ||
        !req.body.username
      ) {
        res.status(400);
        res.send({ message: 'Preencha os campos obrigatórios' });
        return;
      }
      let checkUsername = await usersRepository.getByUsername(req.body.username);
      if (checkUsername) {
        res.status(409);
        res.send({ message: 'Username já está cadastrado' });
        return;
      }
      if (req.body.email) {
        if (
          req.body.email.length < 4 ||
          req.body.email.indexOf('@') < 0 ||
          req.body.email.indexOf('.') < 0
        ) {
          res.status(400);
          res.send({ message: 'Email inválido' });
          return;
        }
      }

      let userEmail = req.body.email.replace(/\s/g, '');

      usersRepository.getByEmail(userEmail).then((existingUser) => {
        if (existingUser) {
          res.status(409);
          res.send({ message: 'Este email já está cadastrado' });
          return;
        } else {
          let user = {
            email: userEmail,
            password: baseLib.security.encryptPassword(
              req.body.password
            ),
            username: req.body.username,
            createdAt: dateTime.create(),
          };

          usersRepository.insert(user).then(() => {
            res.status(200);
            res.send({
              message: 'Novo usuário cadastrado com sucesso!',
            });
          });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
};
