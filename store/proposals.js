export const state = () => ({
  list: []
})

function arrayRemove(arr, value) {
  return arr.filter(function(ele) {
    return ele != value
  })
}

export const mutations = {
  add(state, proposal) {
    state.list.push(proposal)
  },
  remove(state, proposal) {
    state.list = arrayRemove(state.list, proposal)
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
