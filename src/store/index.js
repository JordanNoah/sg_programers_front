import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data_base_name:null
  },
  mutations: {
    database_connected(state,data_base_name){
      setTimeout(() => {
        state.data_base_connected = true
        state.data_base_name = data_base_name
        localStorage.setItem('database_name',data_base_name);
      }, 2000);
    },
    database_disconnected(state){
      state.data_base_connected = false
    }
  },
  actions: {
  },
  modules: {
  }
})
