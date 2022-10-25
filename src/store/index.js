import { createStore } from 'vuex'

export default createStore({
  state: {
    words: []
  },
  getters: {
  },
  mutations: {
    setWords(state, payload) {
      state.words = payload.words
    },
  },
  actions: {
  },
  modules: {
  }
})
