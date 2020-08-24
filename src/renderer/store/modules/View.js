const state = {
  files_bool: false
}

const getters = {
  getFilesBool(state){
    return state.files_bool;
  }
}

const mutations = {
  setFilesBoolFalse (state) {
    state.files_bool = false
  },
  setFilesBoolTrue (state) {
    state.files_bool = true
  },
}

const actions = {
  setFilesBoolFalse ({ commit }) {
    // do something async
    commit('setFilesBoolFalse')
  },
  setFilesBoolTrue ({ commit }) {
    // do something async
    commit('setFilesBoolTrue')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
