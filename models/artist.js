'use strict';

const { Model } = require('objection')
const knex = require('../db/knex')

Model.knex(knex)

module.exports = class Artist extends Model {
  static get tableName() {
    return 'artists'
  }
}
