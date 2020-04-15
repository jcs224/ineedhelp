'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const VoiceResponse = require('twilio').twiml.VoiceResponse

const Need = use('App/Models/Need')
const Ws = use('Ws')

// Homepage
Route.on('/').render('index')

// Twilio routes
Route.get('intro', ({ response }) => {

  const twiml = new VoiceResponse()

  twiml.say('Thanks for calling "I need help".')

  const gather = twiml.gather({
    input: 'dtmf',
    numDigits: 1,
    action: '/agreed',
    method: 'GET'
  })
  gather.say('This call will be recorded and made available on a public website, where someone in your community can reach out to help you. If you accept these terms, please press 1. If you do not accept these terms, please press any other number or hang up.')
  gather.pause({
    length: 3
  })
  twiml.redirect({
    method: 'GET'
  }, '/intro')

  return response.type('text/xml').send(twiml.toString())
})

Route.get('agreed', async ({ request, response }) => {
  const twiml = new VoiceResponse()

  if (request.input('Digits') == '1') {
    twiml.say('Okay, great. After the beep, please introduce yourself and tell us what you need. When you\'ve finished speaking, please wait a few seconds for the next prompt.')
    twiml.record({
      action: '/endcall',
      method: 'GET',
      recordingStatusCallback: '/callrecorded',
      recordingStatusCallbackMethod: 'GET',
    })
    twiml.say('We didn\'t receive any input. If you had any trouble, please hang up and call again. Goodbye!')

    return response.type('text/xml').send(twiml.toString())
  } else {
    twiml.say('You have rejected the terms, so this call will not be recorded and will now end. Goodbye!')
    return response.type('text/xml').send(twiml.toString())
  }
})

Route.get('endcall', async ({ request, response }) => {
  let need = new Need()
  need.call_sid = request.input('CallSid')
  need.phone = request.input('From')
  await need.save()

  const twiml = new VoiceResponse()
  twiml.say('Thanks, your request has been submitted. When a helper assigns themselves to your request, they may reach out to you if they need more information. Goodbye!')
  return response.type('text/xml').send(twiml.toString())
})

Route.get('callrecorded', async ({ request }) => {
  let need = await Need.query().where('call_sid', request.input('CallSid')).first()
  need.recording_url = request.input('RecordingUrl')
  await need.save()

  const needsTopic = Ws.getChannel('needs').topic('needs')
  if (needsTopic) {
    needsTopic.broadcast('need::new', need)
  }
})

// JSON routes
Route.group(() => {
  Route.get('needs', async () => {
    let needs = await Need.query().where('status', 'open').fetch()

    let needsJSON = (needs.toJSON()).map(need => {
      return {
        id: need.id,
        recording_url: need.recording_url,
        created_human_friendly: need.created_human_friendly
      }
    })

    return needsJSON
  })
}).prefix('api')

// User login/registration
Route.get('register', ({ view }) => {
  return view.render('register')
})

Route.get('login', ({ view }) => {
  return view.render('login')
})

Route.get('logout', 'UserController.logout')

Route.post('register', 'UserController.register')
Route.post('login', 'UserController.login')

// Needs
Route.get('needs/:id/help', 'NeedController.help').middleware(['auth'])
Route.get('needs/:id/finish', 'NeedController.finish').middleware(['auth'])
Route.get('needs/:id/putbackinqueue', 'NeedController.putBackInQueue').middleware(['auth'])
Route.get('needs/current', 'NeedController.showCurrentNeed').middleware(['auth'])
Route.get('needs/:id', 'NeedController.show').middleware(['auth'])

Route.get('my-stats', async ({ view, auth }) => {
  let tasksCompletedCount = await Need.query().where('helped_by', auth.user.id).where('status', 'completed').getCount()
  return view.render('my-stats', {
    tasksCompletedCount
  })
}).middleware(['auth'])
