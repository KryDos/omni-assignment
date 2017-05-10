const loki = require('lokijs');

/**
 * this class works with Loki database
 * but you can pass anything in the constructor
 * just make sure required methods are implemented
 */
class db {
    constructor(db_connection) {
        this.db_connection =
            db_connection
            ||
            new loki(process.env.DATABASE_NAME || 'test.db');
        this.collection = undefined;
    }

    setCollection(collection_name) {
        this.collection = this.db_connection.addCollection(collection_name, {clone: true});
    }

    insert(object) {
        this.collection.insert(object);
    }

    find(query) {
        return this.collection
            .chain()
            .find(query);
    }

    remove(query) {
        return this.collection.findAndRemove(query);
    }
}

module.exports = db;
