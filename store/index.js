import cookieparser from 'cookieparser'

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let user = null
    let jwt = null
    if (req && req.headers && req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      user = (parsed.user && JSON.parse(parsed.user)) || null
      jwt = (parsed.jwt && JSON.parse(parsed.jwt)) || null
    }
    commit('auth/setUser', user)
    commit('auth/setJwt', jwt)
  }
}
