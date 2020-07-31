module.exports = class SessionManager {
  static async loginAsUser(agent, user) {
    const password = user.unencryptedPassword || user.password
    const result = await agent
      .post('/user/login')
      .send({
        username: user.email,
        password: password
      })
    return result
  }
}
