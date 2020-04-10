'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NeedSchema extends Schema {
  up () {
    this.create('needs', (table) => {
      table.increments()
      table.string('call_sid')
      table.string('phone')
      table.text('transcription')
      table.string('recording_url')
      table.string('status').defaultTo('open')
      table.integer('helped_by')
      table.timestamps()
    })
  }

  down () {
    this.drop('needs')
  }
}

module.exports = NeedSchema
