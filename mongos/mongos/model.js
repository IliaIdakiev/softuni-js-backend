const mongodb = require('mongodb');
const Document = require('./document');

module.exports = function (getCollectionFn, schema) {
  return {
    create(entry) { // entry { name: "Ivan", age: 20, email: "dsada" }
      const result = Object.entries(schema.definition).reduce((acc, [key, config]) => {
        const entryValue = entry[key];
        const isValidType = typeof entryValue === typeof config.type();
        let isValid = true;
        if (config.validate && config.validate.validator) {
          isValid = config.validate.validator(entryValue);
        }
        const errors = [];
        if (!isValidType) { errors.push(`${key} is not in the correct type!`); }
        if (!isValid) { errors.push(config.validate.message); }
        return acc.concat(errors);
      }, []);
      const collection = getCollectionFn();
      if (result.length === 0) {
        return collection.insert(entry).then(result => {
          return new Document(result.ops[0], this);
        });
      }
      return Promise.reject(result);
    },
    update(query, data) {
      const collection = getCollectionFn();
      if (query._id && !(query._id instanceof mongodb.ObjectID)) {
        query._id = mongodb.ObjectId(query._id);
      }
      if (data.$set) { data = { $set: data }; }
      return collection.update(query, data);
    }
  };
};
