<template>
  <v-container justify-center align-center fluid>
    <v-text-field v-model="search_alta" prepend-inner-icon="fab fa-searchengin" filled dense clearable label="Search"></v-text-field>
    <v-data-table :headers="headers" :search="search_alta" :items="events_receiving_queue" class="elevation-1">
      <template v-slot:[`item.action`]="{ item }">
        <v-btn text small @click="viewMoreEventQueue(item.id)">
          Ver mas
        </v-btn>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        {{transformDate(item.created_at)}}
      </template>
      <template v-slot:[`item.processed_at`]="{ item }">
        <v-chip color="error" dark v-if="item.processed_at == null">
          No procesado
        </v-chip>
        <p v-else class="ma-0">
          {{transformDate(item.processed_at)}}
        </p>
      </template>
      <template v-slot:[`item.status_transaction_catalog.name`]="{ item }">
        <span v-if="item.status_transaction_catalog.abbreviation == 'ip'" class="yellow--text text--accent-4 font-weight-bold">
          {{item.status_transaction_catalog.name}}
        </span>
        <span v-else-if="item.status_transaction_catalog.abbreviation == 'success'" class="light-green--text text--accent-3 font-weight-bold">
          {{item.status_transaction_catalog.name}}
        </span>
        <span v-else class="red--text text--accent-3 font-weight-bold">
          {{item.status_transaction_catalog.name}}
        </span>
      </template>
    </v-data-table>
    <v-menu>
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip right>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn fixed fab small bottom left color="primary" v-on="{...tooltip, ...menu}" v-bind="attrs" :class="reprocessing ? 'fa-spin':''">
              <v-icon>
                fas fa-redo-alt
              </v-icon>
            </v-btn>
          </template>
          <span>
            Reintento
          </span>
        </v-tooltip>
      </template>
      <v-card>
        <v-card-text>
          <div>Quedan: {{time_before}} antes del reintento automatico</div>
          <div>Se procesaran <b>10</b> events queues</div>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn text small @click="retry()">
            Reintento manual
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <WatchMoreEventQueue />
    <router-view></router-view>
  </v-container>
</template>

<script>
  import moment from 'moment'
  import CountDown from 'count-time-down'
  import axios from 'axios'
  export default {
    data() {
      return {
        headers: [{
            text: 'Id',
            value: 'id'
          },
          {
            text: 'Attempts',
            value: 'attempts'
          },
          {
            text: 'Created at',
            value: 'created_at'
          },
          {
            text: 'Processed at',
            value: 'processed_at'
          },
          {
            text: 'Event',
            value: 'event_name'
          },
          {
            text: 'Status',
            value: 'status_transaction_catalog.name',
            sortable: false
          },
          {
            text: '',
            value: 'action',
            sortable: false
          }
        ],
        events_receiving_queue: [],
        time_before: null,
        reprocessing: false,
        search_alta: null
      }
    },
    components: {
      WatchMoreEventQueue: () => import('../components/WatchMoreEventQueue.vue')
    },
    created: function(){
      if (this.$route.params.idEventQueue) {
        this.viewMoreEventQueue(this.$route.params.idEventQueue)
      }
    },
    mounted: function () {
      var body = new Object()
      body.database = 'moodle_4_api_ju'
      axios.post("http://192.168.0.79:3001/get_all_event_receiving_queue", body).then((res) => {
        this.events_receiving_queue = res.data
      })
      new CountDown(864e5, (cd) => {
        this.time_before = cd.hhmmss
      })
      this.$store.state.socket.emit('client:altas_usuario')
      this.$store.state.socket.on('server:altas_usuario',(body)=>{
         const index = this.events_receiving_queue.findIndex( object => {
          return object.id === body.id;
        })
        if (index < 0) {
          this.events_receiving_queue.push(body)
        }else{
          this.events_receiving_queue.splice(index,1,body)
        }
      })
    },
    methods: {
      viewMoreEventQueue(item) {
        this.$router.push({name:'altas',params:{idEventQueue:item}}).then().catch(()=>{})
        this.$store.commit('altas_view_more_event_queue_selected', item)
      },
      retry() {
        this.reprocessing = true
        setTimeout(() => {
          this.reprocessing = false
        }, 2000);
      },
      transformDate(date) {
        return moment.utc(date).format('DD/MM/YYYY h:mm:ss')
      },
    }
  }
</script>