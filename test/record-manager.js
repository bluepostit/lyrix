class RecordManager {
  constructor(db) {
    this.db = db
    this.records = []
  }

  add(record) {
    this.records.push(record)
  }

  /**
   * @returns Promise
   * @param {string} className the name of the entity class, eg. 'Artist'
   */
  destroy(className) {
    let records = this.records.filter(record => {
      return record._modelOptions.name.singular == className
    })
    let ids = records.map(record => record.id)
    return this.db[className].destroy({ where: { id: ids }})
  }
}

module.exports = RecordManager