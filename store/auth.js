import Cookies from 'js-cookie'

export const state = () => {}

export const mutations = {
  setUser(state, user) {
    state.user = user
    Cookies.set('user', user)
  },
  setJwt(state, jwt) {
    state.jwt = jwt
    Cookies.set('jwt', jwt)
  },
  logout(state) {
    state.user = null
    Cookies.set('user', null)
    this.$router.push('/signin')
  }
}

export const getters = {
  username: state => {
    return state.user && state.user.username
  },
  roll: state => {
    return state.user && state.user.role.name
  },
  jwt: state => {
    return state.jwt && state.jwt
  }
}
