const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')
  const Env = use('Env')
  View.global('numberToCallDisplay', Env.get('NUMBER_TO_CALL_DISPLAY'))
  View.global('numberToCallActual', Env.get('NUMBER_TO_CALL_ACTUAL'))
  View.global('websocketUrl', Env.get('WEBSOCKET_URL'))
})
