const express =  require("express");
const router = express.Router();
const SessionController = require("../controllers/SessionController");
const Auth = require('../auth.service');

router.get("/", Auth.requireLogin, SessionController.getAll);
router.post("/", Auth.requireLogin, SessionController.insert);
router.get("/:id", Auth.requireLogin, SessionController.getById);
router.post("/edit", Auth.requireLogin, SessionController.edit);
router.delete("/:id", Auth.requireLogin, SessionController.removeById);

module.exports = router;