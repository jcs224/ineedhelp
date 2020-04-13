'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Need = use('App/Models/Need')

class HasNeedInProgress {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle (ctx, next) {
    try {
      await ctx.auth.check()

      let authUserNeedInProgress = await Need.query().where('helped_by', ctx.auth.user.id).where('status', 'inprogress').first()

      if (authUserNeedInProgress) {
        ctx.view.share({
          authUserNeedInProgress
        })
      } else {
        ctx.view.share({
          authUserNeedInProgress: null
        })
      }

      await next()
    } catch (error) {
      ctx.view.share({
        authUserNeedInProgress: null
      })
      await next()
    }
  }
}

module.exports = HasNeedInProgress
