const categoryRepository = require('../repositories/CategoryRepository');
const dateTime = require('node-datetime');

module.exports = class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await categoryRepository.getAll();
      if (!categories) {
        res.status(404).json('There are no categories yet!');
      }
      res.send(categories);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async getById(req, res) {
    try {
      let id = req.params.id || {};
      const category = await categoryRepository.getById(id);
      res.send(category);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async insert(req, res) {
    try {
      if (!req.body || !req.body.name || !req.body.code) {
        res.status(204).json({ message: 'Preencha os campos obrigatórios!' });
        return;
      }

      let existingCode = await categoryRepository.getByCode(req.body.code);

      if (existingCode) {
        res.status(406);
        res.send({ message: 'Código já cadastrado!' });
        return;
      }

      let categoryData = req.body;
      categoryData.createdAt = dateTime.create(),
        await categoryRepository.insert(categoryData).then(() => {
          res.status(201).json({ message: 'Categoria adicionada!' });
        });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  static async edit(req, res) {
    try {
      if (!req.body || !req.body.updateCategoryData) {
        res.status(400);
        res.send({ message: 'Preencha os campos obrigatórios!' });
        return;
      }

      let updateCategoryData = req.body.updateCategoryData;
      delete updateCategoryData._id
      let categoryId = req.params.id;
      let existingCategory = await categoryRepository.getById(categoryId);
      delete existingCategory._id
      if (!existingCategory) {
        res.status(404);
        res.send({ message: 'Categoria não encontrada' });
        return;
      } else {
        existingCategory = updateCategoryData;
      }

      await categoryRepository.updateOne(existingCategory,categoryId);

      res.status(200);
      res.send({ message: 'Categoria modificada com sucesso!' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error });
    }
  }

  static async removeById(req, res) {
    try {
      if (!req.params.id) {
        res.status(400);
        res.send({ message: 'Informe o ID da categoria!' });
        return;
      }

      let categoryId = req.params.id;

      categoryRepository.getById(categoryId).then((existingCategory) => {
        if (existingCategory) {
          existingCategory.isDeleted = true;
          categoryRepository.updateOne(existingCategory).then(() => {
            res.status(200);
            res.send({ message: 'Categoria removida com sucesso!' });
          });
        } else {
          res.status(400);
          res.send({ message: 'Esta categoria não está cadastrada' });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
};
