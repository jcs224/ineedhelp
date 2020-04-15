'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { DateTime } = require('luxon')
const { parsePhoneNumberFromString  } = require('libphonenumber-js')

class Need extends Model {
  static get computed() {
    return [
      'created_human_friendly',
      'need_phone_proxy_human_friendly'
    ]
  }

  // static get visible() {
  //   return [
  //     'id',
  //     'created_human_friendly',
  //     'recording_url'
  //   ]
  // }

  getCreatedHumanFriendly({ created_at }) {
    return DateTime.fromSQL(created_at).toLocaleString(DateTime.DATETIME_FULL)
  }

  getNeedPhoneProxyHumanFriendly({ need_phone_proxy }) {
    if (need_phone_proxy) {
      const phoneNumber = parsePhoneNumberFromString(need_phone_proxy)
      return phoneNumber.formatNational()
    } else {
      return need_phone_proxy
    }
  }
}

module.exports = Need
