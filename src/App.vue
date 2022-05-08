<template>
  <v-app>
    <v-main>
      <v-app-bar elevation="0" dense>
        <v-chip label link :color="$route.name == 'home' ? 'primary' : ''" @click="changePage('home')">
          <v-icon x-small>
            fas fa-home
          </v-icon>
        </v-chip>
        <v-chip v-for="page in $store.state.pageOpen" :key="page.title" label link close class="mx-1" :color="$route.name == page.name ? 'primary' : ''" @click="changePage(page.name)" @click:close="closePage(page)">
          {{page.name}}
        </v-chip>
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
    var socket = io("http://192.168.0.79:3001")
    this.$store.commit('saveSocket',socket)
  },
  methods:{
    changePage(page){
      this.$router.push({name:page});
    },
    closePage(page){
      this.$store.commit('removePage',page)
    }
  }
}
</script>