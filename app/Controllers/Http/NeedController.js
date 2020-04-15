'use strict'

const Need = use('App/Models/Need')
const Ws = use('Ws')
const Env = use('Env')
const twilioClient = require('twilio')(Env.get('TWILIO_ACCOUNT_SID'), Env.get('TWILIO_AUTH_TOKEN'))
const { v4: uuidv4 } = require('uuid')

class NeedController {
  async show({ params, view }) {
    let need = await Need.find(params.id)

    need = need.toJSON()

    return view.render('need', {
      need: need
    })
  }

  async showCurrentNeed({ auth, view }) {
    let need = await Need.query().where('helped_by', auth.user.id).where('status', 'inprogress').first()

    need = need.toJSON()

    return view.render('need', {
      need: need,
      currentNeedView: true
    })
  }

  async putBackInQueue({ params, response }) {
    let need = await Need.find(params.id)
    need.status = 'open'

    await twilioClient.proxy.services(Env.get('TWILIO_PROXY_SERVICE_SID'))
      .sessions(need.session_sid)
      .remove()

    need.need_phone_proxy = null
    need.user_phone_proxy = null
    need.session_sid = null
    await need.save()

    const needsTopic = Ws.getChannel('needs').topic('needs')
    if (needsTopic) {
      needsTopic.broadcast('need::backinqueue', need)
    }

    response.redirect('/')
  }

  async finish({ params, response }) {
    let need = await Need.find(params.id)
    need.status = 'completed'

    await twilioClient.proxy.services(Env.get('TWILIO_PROXY_SERVICE_SID'))
      .sessions(need.session_sid)
      .remove()

    need.need_phone_proxy = null
    need.user_phone_proxy = null
    need.session_sid = null

    await need.save()

    response.redirect('/')
  }

  async help({ params, auth, response }) {
    let need = await Need.find(params.id)
    need.status = 'inprogress'
    need.helped_by = auth.user.id

    let session = await twilioClient.proxy.services(Env.get('TWILIO_PROXY_SERVICE_SID'))
      .sessions.create({
        uniqueName: 'user-'+auth.user.id+'_need-'+need.id+'_'+uuidv4()
      })

    need.session_sid = session.sid

    let needParticipant = await twilioClient.proxy.services(Env.get('TWILIO_PROXY_SERVICE_SID'))
      .sessions(session.sid)
      .participants
      .create({
        friendlyName: 'need-'+need.id,
        identifier: need.phone
      })

    need.need_phone_proxy = needParticipant.proxyIdentifier

    let userParticipant = await twilioClient.proxy.services(Env.get('TWILIO_PROXY_SERVICE_SID'))
      .sessions(session.sid)
      .participants
      .create({
        friendlyName: 'user-'+auth.user.id,
        identifier: auth.user.phone
      })

    need.user_phone_proxy = userParticipant.proxyIdentifier

    await need.save()

    const needsTopic = Ws.getChannel('needs').topic('needs')
    if (needsTopic) {
      needsTopic.broadcast('need::beinghelped', need)
    }

    response.redirect('/needs/'+need.id)
  }
}

module.exports = NeedController
