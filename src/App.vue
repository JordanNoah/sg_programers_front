<template>
  <v-app>
    <v-main>
      <v-container fill-height fluid justify-center class="d-flex flex-column" v-if="$store.state.data_base_name==null">
        <div class="mb-2 d-flex flex-column">
          <v-icon :color="$store.state.data_base_name ? 'green':'red'" class="mb-2">
            fas fa-database
          </v-icon>
          <p class="ma-0 green--text" v-if="$store.state.data_base_name">
            Database connected
          </p>
          <p class="ma-0 red--text" v-else>
            No database connected
          </p>
        </div>
        <div>
          <v-text-field v-model="data_base_name" outlined dense append-outer-icon="fas fa-plug" @click:append-outer="connect_database"></v-text-field>
        </div>
      </v-container>
      <v-container v-else>
        <v-text-field v-model="search_service" clearable prepend-inner-icon="fab fa-searchengin" outlined dense></v-text-field>
        <v-data-table :headers="headers" :items="services" :search="search_service" :options.sync="options" 
          :loading="loading" class="elevation-1">
          <template v-slot:[`item.activate`]="{ item }">
            <div v-if="item.activate">
              <v-btn icon @click="change_service(item)" color="green">
                <v-icon>
                  fas fa-check-circle
                </v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-btn icon @click="change_service(item)" color="red">
                <v-icon>
                  fas fa-times-circle
                </v-icon>
              </v-btn>
            </div>
          </template>
          </v-data-table>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        showMore:true,
        totalServices: 0,
        services: [],
        loading: true,
        search_service:'',
        options: {},
        data_base_name:'',
        headers: [
          {
            text: 'Id',
            align: 'start',
            sortable: false,
            value: 'id',
          },
          { text: 'Name', value: 'name' },
          { text: 'Activate', value: 'activate' },
        ],
      }
    },
    watch: {
      options: {
        handler () {
          this.getDataFromApi()
        },
        deep: true,
      }
    },
    methods: {
      getDataFromApi () {
        this.loading = true
        var options = JSON.stringify(this.options)
        axios.get(`http://ubuntu20-04.ctdesarrollo.org:3002/api/get_all_result/2/${options}`).then((response)=>{
          this.services = response.data
          this.totalServices = response.data.length
          this.loading = false
        })
      },
      change_service(item){
        var body = new Object();
        var url = '';
        if(item.activate){
          url = "remove_mdl_external_services_functions";
        }else{
          url = "add_mdl_external_services_functions";
        }
        body.functionname = item.name
        body.externalserviceid = 2;
        axios.post(`http://ubuntu20-04.ctdesarrollo.org:3002/api/${url}`,body).then((response)=>{
          if(response.data){
            this.getDataFromApi()
          }
        });
      },
      async connect_database(){
        var body = new Object();
        body.database = this.data_base_name;
        var response = await axios.post('http://192.168.0.79:3002/api/check_database', body);
        console.log(response);
        if(response.data == "connected"){
          this.$store.commit('database_connected',this.data_base_name);
        }else{
          this.$store.commit('database_disconnected');
        }
      }
    },
  }
</script>