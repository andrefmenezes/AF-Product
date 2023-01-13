const productsRepository = require('../repositories/ProductsRepository');

module.exports = class ReportController {
  static async generateReport(req, res) {
    try {
      let filter = req.body;
      if (filter.finalDate) {
        filter.finalDate = new Date(filter.finalDate);
        filter.finalDate.setHours(filter.finalDate.getHours() + 23);
      }
      let reportInfos = await productsRepository.generateReport(filter);
      if (reportInfos.length == 0 || !reportInfos) {
        res.status(404).json({
          message: 'Sem dados para este período. Relatório cancelado.',
        });

        return;
      }
   

      res.send(reportInfos);

    } catch (error) {
      console.log(error)
    }
  }
};
