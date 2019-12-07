'use strict'

const { Model } = require('objection')
const knex = require('../db/knex')

Model.knex(knex)

module.exports = class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get relationMappings () {

  }
}
