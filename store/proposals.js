export const state = () => ({
  list: []
})

export const mutations = {
  add(state, proposal) {
    state.list.push(proposal)
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
