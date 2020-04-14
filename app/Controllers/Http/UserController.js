'use strict'

const Persona = use('Persona')

class UserController {
  async register({ request, response, auth }) {
    let payload = request.only([
      'first_name',
      'last_name',
      'email',
      'phone',
      'password',
      'password_confirmation'
    ])

    let user = await Persona.register(payload)
    await auth.login(user)
    response.redirect('/')
  }

  async login({ request, response, auth }) {
    let payload = request.only([
      'email',
      'password'
    ])

    let loginPayload = {
      uid: payload.email,
      password: payload.password
    }

    let user = await Persona.verify(loginPayload)
    await auth.login(user)
    response.redirect('/')
  }

  async logout({ auth, response }) {
    await auth.logout()
    response.redirect('/')
  }
}

module.exports = UserController
