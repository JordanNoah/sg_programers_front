<template>
    <v-dialog v-model="dialog" @click:outside="removeSelectedEvent()">
        <v-card>
            <v-card-title class="text-h5 d-flex justify-space-between">
                <div>
                    Event queue id:{{eventqueue != null ? eventqueue : ''}}
                </div>
                <div>
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn small icon @click="reprocesar()" :color="reprocesing ? 'success':''" v-bind="attrs"
                                v-on="on">
                                <v-icon small :class="reprocesing ? 'fa-spin':''">
                                    fas fa-sync
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>
                            {{reprocesing?'Reprocesando':'Reprocesar'}}
                        </span>
                    </v-tooltip>
                </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-container fluid>
                <v-row justify="space-between">
                    <v-col cols="6">
                        <div>
                            <p> Id: {{eventqueueInfo != null ? eventqueueInfo.id : ''}}</p>
                            <p> Processed: {{eventqueueInfo != null ? transformDate(eventqueueInfo.processed_at) : ''}}
                            </p>
                            <p> Attempts: {{eventqueueInfo != null ? eventqueueInfo.attempts : ''}} </p>
                            <p> Event: {{eventqueueInfo != null ? eventqueueInfo.event_name : ''}} </p>
                            <p> Status:
                                {{eventqueueInfo != null ? eventqueueInfo.status_transaction_catalog != null ? eventqueueInfo.status_transaction_catalog.name : '' : ''}}
                            </p>
                            <p> Created at: {{ eventqueueInfo != null ? transformDate(eventqueueInfo.created_at) : ''}}
                            </p>
                            <p> Updated at: {{ eventqueueInfo != null ? transformDate(eventqueueInfo.updated_at) : ''}}
                            </p>
                            <div>
                                <v-edit-dialog :return-value.sync="event_queue_received_data" large>
                                    <p class="d-inline-block text-truncate" style="width:500px;cursor:pointer;">
                                        Received data: {{event_queue_received_data}}
                                    </p>
                                    <template v-slot:input>
                                        <v-textarea v-model="event_queue_received_data" filled dense rows="3" no-resize
                                            row-height="20" hide-details></v-textarea>
                                    </template>
                                </v-edit-dialog>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <v-card height="100%" outlined elevation="0">
                            <v-simple-table dense height="370" fixed-header>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">
                                                Id
                                            </th>
                                            <th class="text-left">
                                                Status transaction catalog
                                            </th>
                                            <th class="text-left">
                                                Create at
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in eventqueuelog" :key="item.id"
                                            @click="watchMoreEventQueueLog(item)" style="cursor:pointer" :class="watchMoreEventQueueLogId == item.id ? 'grey lighten-2':''">
                                            <td>{{ item.id }}</td>
                                            <td>{{ item.status_transaction_catalog.name }}</td>
                                            <td>{{ transformDate(item.created_at) }}</td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row no-gutters>
                    <v-col cols="12">
                        <v-data-table dense :headers="headers" :items="requestMoodleLog" item-key="name"
                            class="elevation-0 my-3">
                            <template v-slot:[`item.payload`]="{ item }">
                                <v-edit-dialog :return-value.sync="item.payload">
                                    <span class="d-inline-block text-truncate" style="max-width: 150px;">
                                        {{ item.payload }}
                                    </span>
                                    <template v-slot:input>
                                        <v-card min-width="300" max-width="600" elevation="0">
                                            {{item.payload}}
                                        </v-card>
                                    </template>
                                </v-edit-dialog>
                            </template>
                            <template v-slot:[`item.response_detail`]="{ item }">
                                <v-edit-dialog :return-value.sync="item.response_detail">
                                    <span class="d-inline-block text-truncate" style="max-width: 150px;">
                                        {{ item.response_detail }}
                                    </span>
                                    <template v-slot:input>
                                        <v-card min-width="300" max-width="600" elevation="0">
                                            {{item.response_detail}}
                                        </v-card>
                                    </template>
                                </v-edit-dialog>
                            </template>
                            <template v-slot:[`item.processed`]="{ item }">
                                <v-icon v-if="item.processed" small color="success">
                                    fas fa-check
                                </v-icon>
                                <v-icon v-else small color="error">
                                    fas fa-times
                                </v-icon>
                            </template>
                            <template v-slot:[`item.created_at`]="{ item }">
                                <span>
                                    {{transformDate(item.created_at)}}
                                </span>
                            </template>
                            <template v-slot:[`item.updated_at`]="{ item }">
                                <span>
                                    {{transformDate(item.updated_at)}}
                                </span>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from 'axios'
    import moment from 'moment'
    export default {
        data() {
            return {
                eventqueueInfo: null,
                eventqueuelog: [],
                requestMoodleLog: [],
                event_queue_received_data: '',
                headers: [{
                        text: 'Id',
                        align: 'start',
                        sortable: false,
                        value: 'id',
                    },
                    {
                        text: 'Payload',
                        sortable: false,
                        value: 'payload'
                    },
                    {
                        text: 'Response detail',
                        sortable: false,
                        value: 'response_detail'
                    },
                    {
                        text: 'Processed',
                        align: 'center',
                        sortable: false,
                        value: 'processed'
                    },
                    {
                        text: 'Ws function',
                        sortable: false,
                        value: 'moodle_ws_function.function'
                    },
                    {
                        text: 'Created at',
                        sortable: false,
                        value: 'created_at'
                    },
                    {
                        text: 'Updated at',
                        sortable: false,
                        value: 'updated_at'
                    },
                ],
                watchMoreEventQueueLogId:null,
                reprocesing: false
            }
        },
        computed: {
            dialog() {
                return this.$store.state.altas_view_more_event_queue != null ? true : false
            },
            eventqueue() {
                return this.$store.state.altas_view_more_event_queue
            }
        },
        watch: {
            eventqueueInfo: {
                handler() {
                    if(this.eventqueueInfo!=null){
                        this.event_queue_received_data = JSON.stringify(this.eventqueueInfo.received_data)
                    }
                },
                deep: true
            },
            dialog(newValue) {
                if (newValue) {
                    this.getEventQueueLog()
                }
            },
            eventqueue() {
                this.getEventQueue()
                this.getEventQueueLog()
            }
        },
        mounted: function () {
            if (this.$store.state.altas_view_more_event_queue != null) {
                this.getEventQueue()
                this.getEventQueueLog()
            }
        },
        methods: {
            getEventQueue() {
                var body = new Object()
                body.eventqueueid = this.$store.state.altas_view_more_event_queue
                axios.post('http://192.168.0.79:3001/get_event_receiving_queue_by_id', body).then((res) => {
                    this.eventqueueInfo = res.data
                })
            },
            getEventQueueLog() {
                var body = new Object()
                body.eventqueueid = this.$store.state.altas_view_more_event_queue
                axios.post('http://192.168.0.79:3001/get_all_event_receiving_queue_log', body).then((res) => {
                    this.eventqueuelog = res.data
                })
            },
            watchMoreEventQueueLog(eventQueueLog) {
                var body = new Object()
                body.eventqueue = this.$store.state.altas_view_more_event_queue
                body.eventqueuelog = eventQueueLog.id
                axios.post('http://192.168.0.79:3001/get_all_request_to_moodle_log', body).then((res) => {
                    this.requestMoodleLog = res.data
                })
                this.watchMoreEventQueueLogId = eventQueueLog.id
            },
            removeSelectedEvent() {
                this.eventqueueInfo = null
                this.$store.commit('altas_view_more_event_queue_removed')
                this.$router.push({
                    name: 'altas'
                })
            },
            transformDate(date) {
                return moment.utc(date).format('DD/MM/YYYY h:mm:ss')
            },
            reprocesar() {
                this.reprocesing = true
                setTimeout(() => {
                    this.reprocesing = false
                }, 2000);
            }
        }
    }
</script>