<template>
  <v-app>
    <v-main>
      <v-app-bar elevation="0" dense>
        <div style="width:100%" class="d-flex justify-space-between">
          <div>
            <v-chip label link :color="$route.name == 'home' ? 'primary' : ''" @click="changePage('home')">
              <v-icon x-small>
                fas fa-home
              </v-icon>
            </v-chip>
            <v-chip v-for="page in $store.state.pageOpen" :key="page.title" label link close class="mx-1"
              :color="$route.name == page.name ? 'primary' : ''" @click="changePage(page.name)"
              @click:close="closePage(page)">
              {{page.name}}
            </v-chip>
          </div>
          <div>
            <v-btn icon small class="mx-2" @click="darkMode()">
              <v-icon small v-if="!$vuetify.theme.dark">
                fas fa-sun
              </v-icon>
              <v-icon small color="white" v-else>
                fas fa-moon
              </v-icon>
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon small v-bind="attrs" v-on="on" :color="$store.state.socket.connected ? 'red' : ''"
                  @click="socketChangeStatus()">
                  <v-icon>
                    fas fa-record-vinyl
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="$store.state.socket.connected">
                Conectados
              </span>
              <span v-else>
                Fueras de linea
              </span>
            </v-tooltip>
          </div>
        </div>
      </v-app-bar>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import io from 'socket.io-client'
export default {
  data: () => ({
  }),
  beforeCreate:function(){
    var socket = io("http://192.168.0.135:3001")
    this.$store.commit('saveSocket',socket)
  },
  methods:{
    changePage(page){
      this.$router.push({name:page});
    },
    closePage(page){
      this.$store.commit('removePage',page)
    },
    socketChangeStatus(){
      var status = this.$store.state.socket.connected
      if(status){
        this.$store.state.socket.disconnect()
      }else{
        this.$store.state.socket.connect()
      }
    },
    darkMode(){
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>