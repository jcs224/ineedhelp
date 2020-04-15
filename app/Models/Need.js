'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { DateTime } = require('luxon')

class Need extends Model {
  static get computed() {
    return [
      'created_human_friendly'
    ]
  }

  getCreatedHumanFriendly({ created_at }) {
    return DateTime.fromSQL(created_at).toLocaleString(DateTime.DATETIME_FULL)
  }
}

module.exports = Need
