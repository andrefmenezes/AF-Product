const database = require('../newdatabase');
const { ObjectId } = require('mongodb');

module.exports = class ProductsRepository {
  static async getAll() {
    const db = await database.connect();
    return db.collection('Products').find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
  }
  static async countProducts() {
    const db = await database.connect();
    return db.collection('Products').find({ isDeleted: { $ne: true } }).count();
  }
  static async countProductsPay() {
    const db = await database.connect();
    return db.collection('Products').find({ isDeleted: { $ne: true }, pay: true }).count();
  }
  static async countProductsNoPay() {
    const db = await database.connect();
    return db.collection('Products').find({ isDeleted: { $ne: true }, pay: false }).count();
  }

  static async getByProductCode(productCode) {
    const db = await database.connect();
    return db.collection('Products').findOne({ productCode: productCode, isDeleted: { $ne: true } });
  }
  static async getByName(name) {
    const db = await database.connect();
    return db.collection('Products').findOne({ name: name, isDeleted: { $ne: true } });
  }
  static async getByType(pay) {
    const db = await database.connect();
    return db.collection('Products').find({ pay: pay, isDeleted: { $ne: true } }).toArray();
  }
  static async getByCategory(pay) {
    const db = await database.connect();
    return db.collection('Products').aggregate([
      {
        $match: { pay: pay, isDeleted: { $ne: true } },
      },
      { $group: { _id: "$category", count: { $sum: 1 } } }

    ])
  }
  static async getByMonth(pay) {
    const db = await database.connect();
    if (pay != undefined) {
      return db.collection('Products').aggregate([
        {
          $match: { pay: pay, isDeleted: { $ne: true } },
        },
        { $group: { _id: "$month", total: { $sum: '$value' }, } }

      ])
    } else {
      return db.collection('Products').aggregate([
        {
          $match: { isDeleted: { $ne: true } },
        },
        { $group: { _id: "$month", total: { $sum: '$value' }, } }

      ])
    }

  }
  static async getById(id) {
    const db = await database.connect();
    return db.collection('Products').findOne({ _id: ObjectId(id) });
  }

  static async insert(json) {
    const db = await database.connect();
    return db.collection('Products').insertOne(json);
  }

  static async updateOne(newValue, o_id) {
    const db = await database.connect();
    o_id = new ObjectId(o_id.toString());
    return db.collection('Products').replaceOne({ _id: o_id }, newValue);
  }

  static async removeById(id) {
    const db = await database.connect();
    var o_id = new ObjectId(id.toString());
    return db.collection('Products').deleteOne({ _id: o_id });
  }
  static async generateReport(filter) {
    const db = await database.connect();
    var res;
    if (filter) {
      let query = {};
      let myinitialDate;
      let myfinalDate;
      query.isDeleted = null;
      query.pay = { $exists: true }
      if (filter.initialDate) {
        myinitialDate = new Date(filter.initialDate).toISOString();
      }
      if (filter.finalDate) {
        myfinalDate = new Date(filter.finalDate).toISOString();
      }
      if (filter.initialDate) {
        query.createdAt = {
          $gt: myinitialDate,
          $lt: myfinalDate,
        };
      }
      if (filter.status && filter.status != null) {
        if (filter.status == "Pago") {
          query.pay = true;
        } else {
          query.pay = false;
        }
      }
      if (filter.category && filter.category != null) {
        res = await db
          .collection('Products')
          .find({ 'category.name': filter.category.name, 'pay': query.pay, 'createdAt': query.createdAt, isDeleted: { $ne: true } })
          .sort({ createdAt: -1 })
          .toArray();
      } else {
        res = await db
          .collection('Products')
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();
      }
    }

    return res;
  }

  static async getByTypeAndDateMensal(pay, myStartDate, myEndDate) {
    const db = await database.connect();
    var res = await db
      .collection('Products')
      .find({
        isDeleted: null, pay: pay, createdAt: {
          $gt: myStartDate,
          $lt: myEndDate,
        }
      })
      .toArray();

    return res;
  }
};
