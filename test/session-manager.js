const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const LOGIN_URL = '/api/user/login'

module.exports = class SessionManager {
  /**
  * Logs in with the given user.
  *
  * @param app an Express app instance
  * @param user a User entity to use for logging in.
  * Must have property `unencryptedPassword` set, or login will fail.
  *
  * @returns ChaiAgent the agent to use for subsequent requests
  */
  static async loginAsUser(app, user) {
    const agent = chai.request.agent(app)
    const password = user.unencryptedPassword || user.password
    await agent
      .post(LOGIN_URL)
      .send({
        username: user.email,
        password: password
      })
    return agent
  }
}
