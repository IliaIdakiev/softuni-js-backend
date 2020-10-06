const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

// fs.readFile('./text', function(err, data) {

// });

// fs.readFile().then((data) => ).catch(err => )

module.exports = class BaseModel {
  constructor(filePath) {
    this._filePath = filePath;
    this.entries = require(filePath);
    const lastEntry = this.entries[this.entries.length - 1];
    this._lastEntryId = lastEntry ? lastEntry.id : 0;
  }

  insert(entry) {
    const newEntry = { ...entry, id: this._lastEntryId + 1 };
    const newEntries = [...this.entries, newEntry];
    return writeFile(this._filePath, JSON.stringify(newEntries, null, 2))
      .then(() => { this.entries = newEntries; });
  }

  findById(id) {
    const entry = this.entries.find(entry => entry.id === id);
    return Promise.resolve(entry);
  }

  getAll() {
    return Promise.resolve(this.entries);
  }

  queryBy(fn) {
    const result = this.entries.filter(fn);
    return Promise.resolve(result);
  }
}