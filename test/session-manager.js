module.exports = class SessionManager {
  static async loginAsUser(agent, email, password) {
    const result = await agent
      .post('/user/login')
      .send({
        username: email,
        password: password
      })
    return result
  }
}
