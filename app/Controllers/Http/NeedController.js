'use strict'

const Need = use('App/Models/Need')
const Ws = use('Ws')

class NeedController {
  async show({ params, view }) {
    let need = await Need.find(params.id)

    return view.render('need', {
      need: need
    })
  }

  async showCurrentNeed({ auth, view }) {
    let need = await Need.query().where('helped_by', auth.user.id).where('status', 'inprogress').first()

    return view.render('need', {
      need: need,
      currentNeedView: true
    })
  }

  async putBackInQueue({ params, response }) {
    let need = await Need.find(params.id)
    need.status = 'open'
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
    await need.save()

    response.redirect('/')
  }

  async help({ params, auth, response }) {
    let need = await Need.find(params.id)
    need.status = 'inprogress'
    need.helped_by = auth.user.id
    await need.save()

    const needsTopic = Ws.getChannel('needs').topic('needs')
    if (needsTopic) {
      needsTopic.broadcast('need::beinghelped', need)
    }

    response.redirect('/needs/'+need.id)
  }
}

module.exports = NeedController
