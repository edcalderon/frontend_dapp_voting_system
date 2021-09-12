export const state = () => ({
  list: []
})

/* function arrayFilter(arr, value) {
  return arr.filter(function(ele) {
    return ele == value
  })
} */

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
