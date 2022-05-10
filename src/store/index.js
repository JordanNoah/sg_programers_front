import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data_base_name: null,
    pageOpen: [],
    socket:null,
    wsfunction_databases:null,
    wsfunction_database_name:null,
    wsfunction_external_services:null,
    wsfunction_external_service_selected:null,
    wsfunction_external_functions:[],
    altas_view_more_event_queue:null
  },
  mutations: {
    altas_view_more_event_queue_selected(state,item){
      state.altas_view_more_event_queue = item;
    },
    altas_view_more_event_queue_removed(state){
      state.altas_view_more_event_queue = null
    },
    wsfunction_databases_exist(state, databases){
      state.wsfunction_databases = databases
    },
    database_connected(state, data_base_name) {
        state.wsfunction_database_name = data_base_name
        localStorage.setItem('wsfunction_database_name', data_base_name);
    },
    recived_external_service_selected(state, external_service){
      state.wsfunction_external_service_selected = external_service
    },
    recived_external_service(state, external_service){
      state.wsfunction_external_services = external_service
    },
    recived_external_functions(state, external_function){
      state.wsfunction_external_functions = external_function
    },
    database_disconnected(state) {
      state.wsfunction_database_name = null
      state.wsfunction_external_services = null
      state.wsfunction_external_service_selected = null
      state.wsfunction_external_functions = []
    },
    addPage(state, page){
      if(!(state.pageOpen.some(pages => pages.name === page.name)) && page.name != 'home' && page.name != 'main'){
        state.pageOpen.push(page);
      }
    },
    removePage(state, page){
      if(page.name == "ws function"){
        state.wsfunction_database_name = null
        state.wsfunction_external_services = null
        state.wsfunction_external_service_selected = null
        state.wsfunction_external_functions = []
      }
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
