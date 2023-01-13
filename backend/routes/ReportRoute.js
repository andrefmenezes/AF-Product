const express =  require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");
const Auth = require('../auth.service');

router.post("/generateReport", Auth.requireLogin, ReportController.generateReport);

module.exports = router;