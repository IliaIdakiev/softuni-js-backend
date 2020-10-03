const modelSymbol = Symbol('model');

class Document {
  constructor(record, model) {
    this[modelSymbol] = model;
    Object.entries(record).forEach(([key, value]) => {
      this[key] = value;
    });
  }
  save() {
    this[modelSymbol].update({ _id: this._id }, this);
  }
}

module.exports = Document;