'use strict'

const Persona = use('Persona')
const User = use('App/Models/User')
const { validate } = use('Validator')

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

  async updateProfile({ auth, request, response, session }) {
    const rules = { password: 'confirmed' }
    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      console.log(validation.messages())
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    let user = await User.find(auth.user.id)

    if (request.input('first_name')) user.first_name = request.input('first_name')
    if (request.input('last_name')) user.last_name = request.input('last_name')
    if (request.input('email')) user.email = request.input('email')
    if (request.input('phone')) user.phone = request.input('phone')
    if (request.input('password')) user.password = request.input('password')

    await user.save()

    response.redirect('/')
  }
}

module.exports = UserController
