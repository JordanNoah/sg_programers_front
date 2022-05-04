<template>
    <v-container fluid>
        <div class="d-flex justify-end">
            <v-menu offset-y v-if="$store.state.data_base_name == null" :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn elevation="0" text class="d-flex" v-bind="attrs" v-on="on">
                        <v-icon>
                            mdi-database-remove
                        </v-icon>
                        <p class="mb-0 mx-1">
                            Data base no connected
                        </p>
                    </v-btn>
                </template>
                <v-card>
                    <v-text-field v-model="database_name" outlined dense hide-details append-icon="mdi-database-import" @click:append="connectDatabase"></v-text-field>
                </v-card>
            </v-menu>
            
            <v-btn elevation="0" disabled text v-else-if="$store.state.data_base_name == 'connecting'" class="d-flex">
                <v-icon>
                    mdi-database-clock
                </v-icon>
                <p class="mb-0 mx-1">
                    Connecting data base
                </p>
            </v-btn>
            <v-tooltip v-else left>
                <template v-slot:activator="{on, attrs}">
                    <v-btn elevation="0" text class="d-flex" @click="discconectDatabase" v-bind="attrs" v-on="on">
                        <v-icon>
                            mdi-database-check
                        </v-icon>
                        <p class="mb-0 mx-1">
                            Data base connected
                        </p>
                    </v-btn>
                </template>
                <span>
                    {{database_name}}
                </span>
            </v-tooltip>
        </div>

<v-stepper non-linear>
      <v-stepper-header>
        <v-stepper-step
          editable
          step="1"
        >
          Select campaign settings
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          editable
          step="2"
        >
          Create an ad group
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          step="3"
          editable
        >
          Create an ad
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
                  <v-stepper-content
          v-for="n in steps"
          :key="`${n}-content`"
          :step="n"
        >
          <v-container>
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

          <v-btn
            color="primary"
            @click="nextStep(n)"
          >
            Continue
          </v-btn>

          <v-btn text>
            Cancel
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            database_name: '',
            options: {},
            search_service:'',
            e1: 1,
            steps: 2,
            services: [],
            loading: false,
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
    mounted:function(){
        console.log(this.$store.state.socket)
        this.$store.state.socket.emit('wsfunction',{organization:'funiber',id_custom_service: 2})
        this.$store.state.socket.on('addFunction',(data)=>{console.log(data)})
    },
    watch:{
        options:{
            handler(){
                this.getDataFromApi()
            },
            deep: true
        }
    },
    methods: {
        watch: {
      steps (val) {
        if (this.e1 > val) {
          this.e1 = val
        }
      },
    },

    methods: {
      nextStep (n) {
        if (n === this.steps) {
          this.e1 = 1
        } else {
          this.e1 = n + 1
        }
      },
    },  
        async connectDatabase() {
            if (this.database_name.length != 0) {
                var body = new Object();
                body.database = this.database_name;
                var response = await axios.post('http://192.168.0.79:3002/api/check_database', body);
                if (response.data == "connected") {
                    this.$store.commit('database_connected', this.database_name);
                    this.getDataFromApi();
                } else {
                    this.$store.commit('database_disconnected');
                }
            }
        },
        discconectDatabase() {
            this.database_name = '';
            this.services = [];
            this.$store.commit('database_disconnected');
        },
        getDataFromApi() {
            if(this.database_name.length != 0){
                this.loading = true
                var options = JSON.stringify(this.options)
                var body = new Object()
                body.options = options
                body.id = 2
                body.database = this.database_name
                console.log(body)
                axios.post(`http://192.168.0.79:3002/api/get_all_result`, body).then((response) => {
                    this.services = response.data
                    this.totalServices = response.data.length
                    this.loading = false
                })
            }
        },
        change_service(item) {
            var body = new Object();
            var url = '';
            if (item.activate) {
                url = "remove_mdl_external_services_functions";
            } else {
                url = "add_mdl_external_services_functions";
            }
            body.functionname = item.name
            body.externalserviceid = 2;
            body.database = this.database_name
            axios.post(`http://192.168.0.79:3002/api/${url}`, body).then((response) => {
                if (response.data) {
                    this.getDataFromApi()
                }
            });
        },
    }
}
</script>