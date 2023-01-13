const productRepository = require('../repositories/ProductsRepository');
const moment = require('moment')
module.exports = class ProductsController {
  static async getAll(req, res) {
    try {
      const products = await productRepository.getAll();
      if (!products) {
        res.status(404).json('There are no products yet!');
      }
      res.send(products);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  static async getById(req, res) {
    try {
      let id = req.params.id || {};
      const product = await productRepository.getById(id);
      res.send(product);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
  static async insert(req, res) {
    try {
      if (!req.body || !req.body.name || !req.body.productCode || !req.body.category || !req.body.value || req.body.pay == null || req.body.pay == undefined) {
        res.status(401).json({ message: 'Preencha os campos obrigatórios!' });
        return;
      }

      let existingProductCode = await productRepository.getByProductCode(req.body.productCode);

      if (existingProductCode) {
        res.status(406);
        res.send({ message: 'Produto já cadastrado!' });
        return;
      }
      let existingName = await productRepository.getByName(req.body.name);

      if (existingName) {
        res.status(406);
        res.send({ message: 'Nome já cadastrado!' });
        return;
      }
      let productData = req.body;
      productData.createdAt = (moment().subtract(3, 'hours')).toJSON();
      productData.month = (moment().format('MMM'));

      await productRepository.insert(productData).then(() => {
        res.status(201).json({ message: 'Produto adicionado!' });
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  }
  static async edit(req, res) {
    try {
      if (!req.body || !req.body.updateProductData) {
        res.status(400);
        res.send({ message: 'Preencha os campos obrigatórios!' });
        return;
      }
      let updateProductData = req.body.updateProductData;
      delete updateProductData._id;
      let productId = req.params.id;
      let existingProduct = await productRepository.getById(productId);
      delete existingProduct._id;
      updateProductData.createdAt = existingProduct.createdAt
      updateProductData.month = existingProduct.month
      if (!existingProduct) {
        res.status(404);
        res.send({ message: 'Produto não encontrada' });
        return;
      } else {
        existingProduct = updateProductData;
      }

      await productRepository.updateOne(existingProduct, productId);

      res.status(200);
      res.send({ message: 'Produto modificado com sucesso!' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  }
  static async pay(req, res) {
    try {
      let productId = req.params.id;
      let existingProduct = await productRepository.getById(productId);
      delete existingProduct._id
      if (!existingProduct) {
        res.status(404);
        res.send({ message: 'Produto não encontrada' });
        return;
      } else {
        existingProduct.pay = true;
      }

      await productRepository.updateOne(existingProduct, productId);

      res.status(200);
      res.send({ message: 'Produto pago com sucesso!' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  }
  static async removeById(req, res) {
    try {
      if (!req.params.id) {
        res.status(400);
        res.send({ message: 'Informe o ID do produto!' });
        return;
      }

      let productId = req.params.id;

      productRepository.getById(productId).then((existingProduct) => {
        if (existingProduct) {
          existingProduct.isDeleted = true;
          productRepository.updateOne(existingProduct, productId).then(() => {
            res.status(200);
            res.send({ message: 'Produto removido com sucesso!' });
          });
        } else {
          res.status(400);
          res.send({ message: 'Esta produto não está cadastrado' });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async getDash(req, res) {
    try {
      //dados para o grafico mensal de produtos pagos
      let monthByMonthPay = await productRepository.getByMonth(true);
      let monthByMonthPayAux = [];
      for await (const el of monthByMonthPay) {
        monthByMonthPayAux.push(el.total);
      }
      monthByMonthPayAux.length = 12;

      //dados para o grafico mensal de produtos em aberto
      let monthByMonthNoPay = await productRepository.getByMonth(false);
      let monthByMonthNoPayAux = [];
      for await (const el of monthByMonthNoPay) {
        monthByMonthNoPayAux.push(el.total);
      }
      monthByMonthNoPayAux.length = 12;

      //dados para o grafico mensal do valor total
      let monthByMonthTotal = await productRepository.getByMonth();
      let monthByMonthTotalAux = [];
      for await (const el of monthByMonthTotal) {
        monthByMonthTotalAux.push(el.total);
      }
      monthByMonthTotalAux.length = 12;
      //dados para o comparativo entre categorias
      let categoryPay = await productRepository.getByCategory(true);
      let categoryNoPay = await productRepository.getByCategory(false);
      let categoryAux = [];
      for await (const itemPay of categoryPay) {
        categoryAux.push({
          id: itemPay._id._id,
          name: itemPay._id.name,
          pagos: itemPay.count,
          emAberto: 0,
        })
      }
      for await (const itemNoPay of categoryNoPay) {
        if (categoryAux.filter(item => itemNoPay._id._id == item.id).length == 0) {
          categoryAux.push({
            id: itemNoPay._id._id,
            name: itemNoPay._id.name,
            pagos: 0,
            emAberto: itemNoPay.count,
          })
        }

        for (const item of categoryAux) {
          if (itemNoPay._id._id == item.id) {
            item.emAberto = itemNoPay.count
          }
        }

      }
      //dados para os kpis
      const total = await productRepository.countProducts();
      const qtdPagos = await productRepository.countProductsPay();
      const qtdEmAberto = await productRepository.countProductsNoPay();
      //dados para o grafico pagos x em aberto
      let lastDayOfMonth = moment().endOf('month').format()
      let firstDayOfMonth = moment().startOf('month').format()
      const qtdDayDayPay = await productRepository.getByTypeAndDateMensal(true, firstDayOfMonth, lastDayOfMonth);
      const qtdDayDayNoPay = await productRepository.getByTypeAndDateMensal(false, firstDayOfMonth, lastDayOfMonth);
      let lastDay = moment().daysInMonth()
      let auxPay = [];
      let auxNoPay = [];
      let auxTotal = [];
      for (let index = 0; index < lastDay; index++) {
        for (let j = 0; j < qtdDayDayPay.length; j++) {
          const element = qtdDayDayPay[j];
          if ((parseInt(element.createdAt.substring(8, 10)) - 1) == index) {
            auxPay[index] = (auxPay[index] != undefined ? auxPay[index] + element.value : element.value)
          }

        }
        auxPay[index] = (auxPay[index] == undefined ? 0 : auxPay[index])
      }
      for (let index = 0; index < lastDay; index++) {
        for (let j = 0; j < qtdDayDayNoPay.length; j++) {
          const element = qtdDayDayNoPay[j];
          //console.log((element.createdAt).substring(0,2))
          if ((parseInt(element.createdAt.substring(8, 10)) - 1) == index) {
            auxNoPay[index] = (auxNoPay[index] != undefined ? auxNoPay[index] + element.value : element.value)
          }

        }
        auxNoPay[index] = (auxNoPay[index] == undefined ? 0 : auxNoPay[index])

      }
      for (let index = 0; index < auxPay.length; index++) {
        let sum = Number(auxPay[index]) + Number(auxNoPay[index])
        auxTotal.push(sum.toFixed(1))
      }
      //dados para a tabela de pagos e em aberto
      let productsPay = await productRepository.getByType(true);
      productsPay = productsPay.map(res => ({ value: res.name, text: res.category.name }))
      let productsNoPay = await productRepository.getByType(false);
      productsNoPay = productsNoPay.map(res => ({ value: res.name, text: res.category.name }))

      res.send({
        total: total,
        qtdPagos: qtdPagos,
        qtdEmAberto: qtdEmAberto,
        mensalNoPay: auxNoPay,
        mensalPay: auxPay,
        mensalTotal: auxTotal,
        productsPay: productsPay,
        productsNoPay: productsNoPay,
        category: categoryAux,
        monthByMonthPay: monthByMonthPayAux,
        monthByMonthNoPay: monthByMonthNoPayAux,
        monthByMonthTotal: monthByMonthTotalAux

      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  }

};
