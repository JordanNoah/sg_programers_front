<template>
    <v-container fluid>
        <div class="d-flex justify-space-between">
            <div class="d-flex">
                <div>
                    <v-btn depressed small text> Organization </v-btn>
                </div>/
                <div>
                    <v-btn depressed small text> Services </v-btn>
                </div>/
                <div>
                    <v-btn depressed small text> Ws functions </v-btn>
                </div>
            </div>
            <div>
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
                        <v-select v-model="database" return-object outlined dense hide-details :items="databases"
                            item-text="name" item-value="id" @change="changeDataBase"></v-select>
                    </v-card>
                </v-menu>

                <v-btn elevation="0" disabled text v-else-if="$store.state.data_base_name == 'connecting'"
                    class="d-flex">
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
                        {{$store.state.data_base_name.name}}
                    </span>
                </v-tooltip>
            </div>
        </div>
        <div class="my-2">
            <v-simple-table fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                External service
                            </th>
                            <th class="text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in desserts" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td @click="changeFunction(item)">
                                <v-btn text small>
                                    View
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div>
            <div class="d-flex justify-center align-center">
                <v-text-field v-model="search_service" clearable prepend-inner-icon="fab fa-searchengin" outlined dense hide-details></v-text-field>
                <v-btn small class="mx-1" depressed text @click="activateAll()">Activar todo</v-btn>
            </div>
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
        </div>
    </v-container>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                database: null,
                databases:[],
                options: {},
                search_service: '',
                e1: 1,
                steps: 2,
                services: [],
                loading: false,
                headers: [{
                        text: 'Id',
                        align: 'start',
                        sortable: false,
                        value: 'id',
                    },
                    {
                        text: 'Name',
                        value: 'name'
                    },
                    {
                        text: 'Activate',
                        value: 'activate'
                    },
                ],
                items: [{
                        text: 'Dashboard',
                        disabled: false,
                        href: 'breadcrumbs_dashboard'
                    },
                    {
                        text: 'Link 1',
                        disabled: false
                    },
                    {
                        text: 'Link 2',
                        disabled: true
                    },
                ],
                functionSelected : null,
                desserts: []
            }
        },
        mounted: function () {
            axios.get("http://192.168.0.79:3001/organization").then((res)=>{this.databases=res.data})
            this.$store.state.socket.emit('wsfunction', {
                organization: 'funiber',
                id_custom_service: 2
            })
            this.$store.state.socket.on('addFunction', () => {return})
        },
        watch: {
            options: {
                handler() {
                    this.getDataFromApi()
                },
                deep: true
            }
        },
        methods: {
            async changeDataBase(){
                if (this.database != null) {
                    var body = new Object();
                    body.database = this.database;
                    var response = await axios.post('http://192.168.0.79:3001/check_database', body);
                    if (response.data == "connected") {
                        this.$store.commit('database_connected', this.database);
                        this.getFuntionList();
                    } else {
                        this.$store.commit('database_disconnected');
                    }
                }
            },
            async getFuntionList(){
                var body = new Object();
                body.database = this.database;
                var response = await axios.post('http://192.168.0.79:3001/getFuntionList', body);
                this.desserts = response.data;
                
            },
            discconectDatabase() {
                this.database = '';
                this.services = [];
                this.$store.commit('database_disconnected');
            },
            changeFunction(item){
                this.functionSelected = item
                this.getDataFromApi()
            },
            getDataFromApi() {
                if (this.functionSelected != null) {
                    this.loading = true
                    var options = JSON.stringify(this.options)
                    var body = new Object()
                    body.options = options
                    body.id = this.functionSelected.id
                    body.database = this.database
                    axios.post(`http://192.168.0.79:3001/get_all_result`, body).then((response) => {
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
                body.externalserviceid = this.functionSelected.id;
                body.database = this.database
                console.log(body);
                axios.post(`http://192.168.0.79:3001/${url}`, body).then((response) => {
                    if (response.data) {
                        this.getDataFromApi()
                    }
                });
            },
            activateAll(){
                var body = new Object()
                body.externalserviceid = this.functionSelected.id;
                body.database = this.database
                axios.post('http://192.168.0.79:3001/activate_all_mdl_external_services_functions',body).then((response)=>{
                    console.log(response);
                });
            }
        }
    }
</script>