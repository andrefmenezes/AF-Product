const database = require('../newdatabase');
const { ObjectId } = require('mongodb');

module.exports = class CategoryRepository {
    static async getAll() {
        const db = await database.connect();
        return db.collection('Category').find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).toArray();
    }

    static async getByCode(code) {
        const db = await database.connect();
        return db.collection('Category').findOne({ code: code, isDeleted: { $ne: true } });
    }
    static async getById(id) {
        const db = await database.connect();
        return db.collection('Category').findOne({ _id: ObjectId(id) });
    }

    static async insert(json) {
        const db = await database.connect();
        return db.collection('Category').insertOne(json);
    }

    static async updateOne(newValue, o_id) {
        const db = await database.connect();
        o_id = new ObjectId(o_id.toString());
        delete newValue._id
        return db.collection('Category').replaceOne({ _id: o_id }, newValue);
    }

    static async removeById(id) {
        const db = await database.connect();
        var o_id = new ObjectId(id.toString());
        return db.collection('Category').deleteOne({ _id: o_id });
    }
};
