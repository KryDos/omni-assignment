const db = require('./db');

class repository {
    constructor(db_instance, collection_name) {
        this.db = db_instance || new db();
        this.collection_name = collection_name || 'config';
        this.db.setCollection(this.collection_name);
    }
    getDataSinceTag(etag, client, version, cb) {
        etag = etag || 0;
        var results = this.db.find({
            '$and': [
                {
                    'client': client
                },
                {
                    'version': version
                },
                {
                    '_created': {
                        '$gt': etag
                    }
                }
            ]
        }).simplesort('_created').data();

        // getting Etag value.
        // it is the _created property of
        // the latest reslut
        var latest_record_timestamp = null;
        if (results.length > 0) {
            latest_record_timestamp = results[results.length - 1]._created;
        }

        // since we have array of objects
        // this reduce() should convert it
        // to single object
        results = results.reduce((acc, result) => {
            acc[result.key] = result.value;
            return acc;
        }, {});

        cb({
            results,
            latest_record_timestamp
        });
    }
    storeData(object) {
        // this one will be used as ETag
        object._created = Date.now();

        // since Loki isn't key/value storage
        // we should emulate "value replacement" mechanism
        // by removing and then inserting.
        // Probably simple update could be efficient
        // NOTE: in case we need to keep history of changes
        // for a key we can just skip this method because
        // in getDataSinceTag() we reduce the array of objects
        // so duplicated keys will be overriden anyway
        this.db.remove({
            '$and': [
                {
                    client: object.client
                },
                {
                    version: object.version
                },
                {
                    key: object.key
                }
            ]
        });
        this.db.insert(object);
    }
}

module.exports = repository;
