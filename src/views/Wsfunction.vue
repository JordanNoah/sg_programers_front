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
        <div>
            <v-simple-table fixed-header height="300px">
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
                            <td @click="changeFunction()">
                                <v-btn text small>
                                    View
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
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
                desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
          },
          {
            name: 'Eclair',
            calories: 262,
          },
          {
            name: 'Cupcake',
            calories: 305,
          },
          {
            name: 'Gingerbread',
            calories: 356,
          },
          {
            name: 'Jelly bean',
            calories: 375,
          },
          {
            name: 'Lollipop',
            calories: 392,
          },
          {
            name: 'Honeycomb',
            calories: 408,
          },
          {
            name: 'Donut',
            calories: 452,
          },
          {
            name: 'KitKat',
            calories: 518,
          },
        ],
            }
        },
        mounted: function () {
            axios.get("http://192.168.0.79:3001/organization").then((res)=>{this.databases=res.data})
            console.log(this.$store.state.socket)
            this.$store.state.socket.emit('wsfunction', {
                organization: 'funiber',
                id_custom_service: 2
            })
            this.$store.state.socket.on('addFunction', (data) => {
                console.log(data)
            })
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
                console.log(response);
            },
            discconectDatabase() {
                this.database = '';
                this.services = [];
                this.$store.commit('database_disconnected');
            },
            changeFunction(){
                console.log("changing");
            },
            getDataFromApi() {
                if (this.database.length != 0) {
                    this.loading = true
                    var options = JSON.stringify(this.options)
                    var body = new Object()
                    body.options = options
                    body.id = 2
                    body.database = this.database
                    console.log(body)
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
                body.externalserviceid = 2;
                body.database = this.database
                axios.post(`http://192.168.0.79:3002/api/${url}`, body).then((response) => {
                    if (response.data) {
                        this.getDataFromApi()
                    }
                });
            },
        }
    }
</script>