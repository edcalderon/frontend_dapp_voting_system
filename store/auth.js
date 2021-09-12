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
    Cookies.set('jwt', null)
    this.$router.push('/signin')
  }
}

export const getters = {
  user: state => {
    return state.user
  },
  userId: state => {
    return state.user && state.user._id
  },
  username: state => {
    return state.user && state.user.username
  },
  userWallet: state => {
    return state.user && state.user.wallet
  },
  userRoll: state => {
    return state.user && state.user.role.name
  },
  jwt: state => {
    return state.jwt && state.jwt
  }
}
