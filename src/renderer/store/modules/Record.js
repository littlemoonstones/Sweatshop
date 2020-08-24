import readFileSync from "../../assets/loading-file"

const state = {
  data: {},
  pecd_state: {
    process: "",
    initial_time: 0,
    final_time: 0,
    real_time: 0,
    initial_transmittance: 0,
    fianl_transmittance: 0,
    response_time: 0,
    ideal_transmittance: 0,
    real_transmittance: 0,
    transmittance: 0
  },
  record_data: {
    bleaching: [],
    coloring: []
  }
}

const getters = {
  getData(state) {
    return state.data;
  },
  getPECDSate(state) {
    return state.pecd_state;
  },
  getRecordData(state) {
    return state.record_data;
  },
  getBleachData(state) {
    return state.record_data.bleaching;
  },
  getColorData(state) {
    return state.record_data.coloring;
  }
}

const mutations = {
  setData(state, data){
    state.data = data
  },
  updatePECDSate(state, new_state) {
    state.pecd_state.process = new_state.process
    state.pecd_state.initial_time = new_state.initial_time
    state.pecd_state.final_time = new_state.final_time
    state.pecd_state.real_time = new_state.real_time
    state.pecd_state.initial_transmittance = new_state.initial_transmittance
    state.pecd_state.fianl_transmittance = new_state.fianl_transmittance
    state.pecd_state.response_time = new_state.response_time
    state.pecd_state.ideal_transmittance = new_state.ideal_transmittance
    state.pecd_state.real_transmittance = new_state.real_transmittance
    state.pecd_state.transmittance = Math.round(new_state.transmittance*1000+0.5)/1000
  },
  updateRecordData(state) {
    let copy_state = JSON.parse(JSON.stringify(state))
    if(state.pecd_state.process == "Bleaching -> Coloring"){
      state.record_data.coloring.push(copy_state.pecd_state)
    }else{
      state.record_data.bleaching.push(copy_state.pecd_state)
    }
  },
  clean(state){
    state.pecd_state =  {
      process: "",
      initial_time: 0,
      final_time: 0,
      real_time: 0,
      initial_transmittance: 0,
      fianl_transmittance: 0,
      response_time: 0,
      ideal_transmittance: 0,
      real_transmittance: 0,
      transmittance: 0
    }
    state.record_data = {
      bleaching: [],
      coloring: []
    }
  },
  cleanData(state){
    state.data = {}
  }
}

const actions = {
  updateData({ commit }, new_state) {
    // do something async
    // console.log('update')
    commit('updatePECDSate', new_state)
  },
  addRecord({ commit }) {
    commit('updateRecordData')
  },
  clean({ commit }) {
    commit('clean')
  },
  cleanData({commit}){
    commit('cleanData')
  },
  readData({commit}, path){
    let data = readFileSync(path)
    // console.log('@Vuex-readData: ', data)
    commit('setData', data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
