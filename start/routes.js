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

Route.on('/').render('welcome')

Route.get('/intro', ({ request, response }) => {
  console.log(request.input('CallSid'))

  const twiml = new VoiceResponse()
  const gather = twiml.gather({
    input: 'dtmf speech',
    numDigits: 1,
    action: '/getname',
    method: 'GET'
  })

  gather.say('Thanks for calling "I need stuff". After the beep, please state your name. Once you\'ve stated your name, press any number to continue.')
  twiml.say('We didn\'t receive any input. Goodbye!')

  return response.type('text/xml').send(twiml.toString())
})

Route.get('/getname', ({ request, response }) => {
  console.log(request.input('CallSid'))

  const twiml = new VoiceResponse()
  // const gather = twiml.gather({
  //   input: 'dtmf speech',
  //   numDigits: 1,

  // })

  twiml.say('Thanks, goodbye!')

  return response.type('text/xml').send(twiml.toString())
})


