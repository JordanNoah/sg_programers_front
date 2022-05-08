<template>
    <v-container fluid>
        <div class="d-flex justify-end">
            <div>
                <v-menu offset-y v-if="$store.state.wsfunction_database_name == null" :close-on-content-click="false">
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
                        <v-select v-model="database" return-object outlined dense hide-details
                            :items="$store.state.wsfunction_databases" item-text="name" item-value="id"
                            @change="changeDataBase"></v-select>
                    </v-card>
                </v-menu>

                <v-btn elevation="0" disabled text v-else-if="$store.state.wsfunction_database_name == 'connecting'"
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
                        {{$store.state.wsfunction_database_name.name}}
                    </span>
                </v-tooltip>
            </div>
        </div>
        <div class="my-2" v-if="$store.state.wsfunction_database_name != null">
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
                        <tr v-for="item in $store.state.wsfunction_external_services" :key="item.name">
                            <td>{{ item.name }}</td>
                            <td @click="changeExternalService(item)">
                                <v-btn text small>
                                    View
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </div>
        <div
            v-show="$store.state.wsfunction_database_name != null && $store.state.wsfunction_external_service_selected != null">
            <div class="d-flex justify-center align-center my-2">
                <v-text-field v-model="search_service" clearable prepend-inner-icon="fab fa-searchengin" outlined dense
                    hide-details></v-text-field>
                <div class="d-flex flex-column mx-1">
                    <v-btn small depressed text @click="activateAll()">Activar todo</v-btn>
                    <v-btn small depressed text @click="desactivateAll()">Desactivar todo</v-btn>
                </div>
            </div>
            <v-data-table :headers="headers" :items="$store.state.wsfunction_external_functions"
                :search="search_service" :options.sync="options" :loading="loading" class="elevation-1">
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
                options: {},
                search_service: '',
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
                ]
            }
        },
        mounted: function () {
            axios.post("http://192.168.0.79:3001/organization").then((res) => {
                this.$store.commit('wsfunction_databases_exist', res.data)
            })
            this.$store.state.socket.on('server:add_mdl_external_services_functions', (body) => {
                const index = this.$store.state.wsfunction_external_functions.findIndex(object => {
                    return object.name == body
                });
                this.$store.state.wsfunction_external_functions[index].activate = 1;
            })
            this.$store.state.socket.on('server:remove_mdl_external_services_functions', (body) => {
                const index = this.$store.state.wsfunction_external_functions.findIndex(object => {
                    return object.name == body
                });
                this.$store.state.wsfunction_external_functions[index].activate = 0;
            })
            this.$store.state.socket.on('server:activate_all_mdl_external_services_functions', (body) => {
                if (body) {
                    var newArray = this.$store.state.wsfunction_external_functions.map(obj => {
                        return {
                            ...obj,
                            activate: 1
                        }
                    })
                    this.$store.state.wsfunction_external_functions = newArray;
                }
            })
            this.$store.state.socket.on('server:desactivate_all_mdl_external_services_functions', (body) => {
                if (body) {
                    var newArray = this.$store.state.wsfunction_external_functions.map(obj => {
                        return {
                            ...obj,
                            activate: 0
                        }
                    })
                    this.$store.state.wsfunction_external_functions = newArray;
                }
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
            async changeDataBase() {
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
            async getFuntionList() {
                var body = new Object();
                body.database = this.$store.state.wsfunction_database_name;
                var response = await axios.post('http://192.168.0.79:3001/getFuntionList', body);
                this.$store.commit('recived_external_service', response.data)

            },
            discconectDatabase() {
                this.$store.commit('database_disconnected');
            },
            changeExternalService(item) {
                this.$store.commit('recived_external_service_selected', item)
                var body = new Object()
                body.database = this.$store.state.wsfunction_database_name
                body.function = this.$store.state.wsfunction_external_service_selected
                this.$store.state.socket.emit('wsfunction', body)
                this.getDataFromApi()
            },
            getDataFromApi() {
                if (this.$store.state.wsfunction_external_service_selected != null) {
                    this.loading = true
                    var options = JSON.stringify(this.options)
                    var body = new Object()
                    body.options = options
                    body.id = this.$store.state.wsfunction_external_service_selected.id
                    body.database = this.$store.state.wsfunction_database_name
                    body.socket = this.$store.state.socket.id
                    axios.post(`http://192.168.0.79:3001/get_all_result`, body).then((response) => {
                        this.$store.commit('recived_external_functions', response.data)
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
                body.externalserviceid = this.$store.state.wsfunction_external_service_selected.id;
                body.database = this.$store.state.wsfunction_database_name
                body.function = this.$store.state.wsfunction_external_service_selected
                this.$store.state.socket.emit(`client:${url}`, body)
            },
            activateAll() {
                var body = new Object()
                body.externalserviceid = this.$store.state.wsfunction_external_service_selected.id;
                body.database = this.$store.state.wsfunction_database_name
                body.function = this.$store.state.wsfunction_external_service_selected
                this.$store.state.socket.emit('client:activate_all_mdl_external_services_functions', body)
            },
            desactivateAll() {
                var body = new Object()
                body.externalserviceid = this.$store.state.wsfunction_external_service_selected.id;
                body.database = this.$store.state.wsfunction_database_name
                body.function = this.$store.state.wsfunction_external_service_selected
                this.$store.state.socket.emit('client:desactivate_all_mdl_external_services_functions', body)
            }
        }
    }
</script>