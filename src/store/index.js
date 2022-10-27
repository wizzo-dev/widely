import { createStore } from 'vuex'

export default createStore({
  state: {
    words: [],
    isLoading: false
  },
  getters: {
  },
  mutations: {
    setWords(state, payload) {
      state.words = payload.words
    },
    setIsLoading(state, payload) {
      state.isLoading = payload.isLoading
    }
  },
  actions: {
  },
  modules: {
  }
})
