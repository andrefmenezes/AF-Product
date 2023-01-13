const database = require("../newdatabase");
const { ObjectId } = require("mongodb");

module.exports = class SessionRepository {
  static async getAll() {
    const db = await database.connect();
    return db.collection("Session").find().toArray();
  }

  static async getById(id) {
    const db = await database.connect();
    return db.collection("Session").findOne({ _id: ObjectId(id) });
  }

  static async insert(json) {
    const db = await database.connect();
    return db.collection("Session").insertOne(json);
  }

  static async updateOne(newValue) {
    const db = await database.connect();
    var o_id = new ObjectId(newValue._id.toString());
    return db.collection("Session").replaceOne({"_id": o_id}, newValue);
  }

  static async removeById(id) {
    const db = await database.connect();
    var o_id = new ObjectId(id.toString());
    return db.collection("Session").deleteOne({"_id": o_id});
  }
}