import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data_base_name: null,
    pageOpen: [],
    socket:null
  },
  mutations: {
    database_connected(state, data_base_name) {
      console.log(data_base_name);
      state.data_base_name = 'connecting'
      setTimeout(() => {
        state.data_base_name = data_base_name
        localStorage.setItem('database_name', data_base_name);
      }, 2000);
    },
    database_disconnected(state) {
      state.data_base_name = null
    },
    addPage(state, page){
      if(!(state.pageOpen.some(pages => pages.name === page.name)) && page.name != 'home' && page.name != 'main'){
        state.pageOpen.push(page);
      }
    },
    removePage(state, page){
      var index = state.pageOpen.findIndex(item => item.name === page.name);
      state.pageOpen.splice(index,1)
      if(state.pageOpen.length != 0){
        var pageToPush = state.pageOpen[state.pageOpen.length - 1]
        router.push({name:pageToPush.name})
      }else{
        router.push({name:'home'})
      }
    },
    saveSocket(state,socket){
      state.socket = socket
    },
    removeSocket(state){
      state.socket = null
    }
  },
  actions: {},
  modules: {}
})
