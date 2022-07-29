export const state = () => ({
  list: []
})

export const mutations = {
  add(state, candidate) {
    state.list.push(candidate)
  },
  emptyList(state) {
    state.list = []
  }
}

export const getters = {
  list: state => {
    return state.list
  }
}
