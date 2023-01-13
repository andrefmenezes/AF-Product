const database = require('../newdatabase');
const { ObjectId } = require('mongodb');

module.exports = class UsersRepository {
  static async getByEmail(email) {
    const db = await database.connect();
    var res = await db.collection('Users').findOne({ email: email });
    return res;
  }

  static async getByUsername(username) {
    const db = await database.connect();
    var res = await db.collection('Users').findOne({ username: username });
    return res;
  }

  static async getAll() {
    const db = await database.connect();
    var res = await db.collection('Users').find().toArray();
    return res;
  }

  static async insert(json) {
    const db = await database.connect();
    return db.collection('Users').insertOne(json);
  }

  static async getById(id) {
    const db = await database.connect();
    var res = await db.collection("Users").findOne({ _id: ObjectId(id) });
    return res;
  }

};
