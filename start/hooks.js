const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const View = use('View')
  const Env = use('Env')
  View.global('numberToCall', Env.get('NUMBER_TO_CALL'))
})
