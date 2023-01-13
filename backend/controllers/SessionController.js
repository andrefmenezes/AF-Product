const sessionRepository = require("../repositories/SessionRepository");

module.exports = class SessionController {

  static async getAll(req, res) {
    try {
      const session = await sessionRepository.getAll();
      if(!session){
        res.status(404).json("There are no sessions yet!")
      }
      res.send(session);
    } catch (error) {
      res.status(500).json({error: error})
    }
  }

  static async getById(req, res) {
    try {
      let id = req.params.id || {};
      const session = await sessionRepository.getById(id);
      res.send(session);
    } catch (error) {
      res.status(500).json({error: error});
    }
  }

  static async insert(req, res) {
    try {
      let json = req.body;
      const session = await sessionRepository.insert(json);
      res.send(session);
    } catch (error) {
      res.status(500).json({error: error});
    }
  }

  static async edit(req, res) {
    try {
      let newValue = req.body;
      const session = await sessionRepository.updateOne(newValue);
      res.send(session);
    } catch (error) {
      res.status(500).json({error: error});
    }
  }

  static async removeById(req, res) {
    try {
      if (!req.params.id) {
        res.status(400);
        res.send({ message: "Informe o ID da sessão!" });
        return;
      }
  
      let sessionId = req.params.id;
  
      sessionRepository.getById(sessionId).then((existingSession) => {
        if (existingSession) {
          sessionRepository.removeById(sessionId).then(() => {
            res.status(200);
            res.send({ message: "Sessão removida com sucesso!" });
          });
        } else {
          res.status(400);
          res.send({ message: "Não foi possível remover a sessão." });
        }
      });
    } catch (error) {
      res.status(500).json({error: error})
    }
  }
}