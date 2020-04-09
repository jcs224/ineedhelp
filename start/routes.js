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

Route.on('/').render('index')

Route.get('/intro', async ({ request, response }) => {
  let need = new Need()
  need.call_sid = request.input('CallSid')
  need.phone = request.input('From')
  await need.save()

  const twiml = new VoiceResponse()
  const gather = twiml.gather({
    input: 'dtmf speech',
    numDigits: 1,
    action: '/getname',
    method: 'GET'
  })

  gather.say('Thanks for calling "I need stuff". Please say your name. Once you\'ve stated your name, press any number to continue.')
  twiml.say('We didn\'t receive any input. If you had any trouble, please hang up and call again. Goodbye!')

  return response.type('text/xml').send(twiml.toString())
})

Route.get('/getname', async ({ request, response }) => {
  let need = await Need.query().where('call_sid', request.input('CallSid')).first()
  need.name = request.input('SpeechResult')
  await need.save()

  const twiml = new VoiceResponse()
  const gather = twiml.gather({
    input: 'dtmf speech',
    numDigits: 1,
    action: '/getdescription',
    method: 'GET'
  })

  gather.say('Thanks. Now, please tell us what you need, then press any number.')
  twiml.say('We didn\'t receive any input. If you had any trouble, please hang up and call again. Goodbye!')

  return response.type('text/xml').send(twiml.toString())
})

Route.get('/getdescription', async ({ request, response }) => {
  let need = await Need.query().where('call_sid', request.input('CallSid')).first()
  need.description = request.input('SpeechResult')
  await need.save()

  const twiml = new VoiceResponse()
  twiml.say('Thanks, your request has been submitted. Goodbye!')

  return response.type('text/xml').send(twiml.toString())
})

Route.group(() => {
  Route.get('needs', async () => {
    let needs = await Need.all()
    return needs
  })
}).prefix('api')


