'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NeedSchema extends Schema {
  up () {
    this.create('needs', (table) => {
      table.increments()
      table.string('call_sid')
      table.string('phone')
      table.string('name')
      table.text('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('needs')
  }
}

module.exports = NeedSchema
