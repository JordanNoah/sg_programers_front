<template>
  <div>
    <v-system-bar color="warning" style="height: 24px; position: fixed; width: 100%; bottom: 0;z-index: 99;">
        <v-icon @click="retry()" :class="reprocessing?'fa-spin':''">fas fa-redo-alt</v-icon>
        <div style="width:inherit" class="d-flex justify-end">
          <div v-for="(statusTransaction,index) in statusTransactionCatalogs " :key="statusTransaction.id" class="d-flex">
            <QuickAltasInfo :statusTransactionCatalog="statusTransaction"></QuickAltasInfo>
            <v-divider vertical v-if="index < statusTransactionCatalogs.length-1"></v-divider>
          </div>
        </div>
      </v-system-bar>
    <v-container justify-center align-center fluid>
    <v-text-field v-model="search_alta" prepend-inner-icon="fab fa-searchengin" filled dense clearable label="Search">
    </v-text-field>
    <v-data-table :headers="headers" :search="search_alta" :items="events_receiving_queue" class="elevation-1 mb-5">
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
        <span v-if="item.status_transaction_catalog.abbreviation == 'ip'"
          class="yellow--text text--accent-4 font-weight-bold">
          {{item.status_transaction_catalog.name}}
        </span>
        <span v-else-if="item.status_transaction_catalog.abbreviation == 'success'"
          class="light-green--text text--accent-3 font-weight-bold">
          {{item.status_transaction_catalog.name}}
        </span>
        <span v-else class="red--text text--accent-3 font-weight-bold">
          {{item.status_transaction_catalog.name}}
        </span>
      </template>
    </v-data-table>
    <!-- <v-menu>
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip right>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn fixed fab small bottom left color="primary" v-on="{...tooltip, ...menu}" v-bind="attrs"
              :class="reprocessing ? 'fa-spin':''">
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
    </v-menu> -->
    <WatchMoreEventQueue />
    <v-snackbar :timeout="-1" :value="false" right outlined color="transparent">
      <v-alert outlined type="warning" elevation="0" border="left" dense v-for="key in alerts" :key="key.id" transition="scroll-x-reverse-transition">
        Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Suspendisse non nisl sit amet velit
        hendrerit rutrum. Nullam vel sem. Pellentesque dapibus hendrerit tortor.
      </v-alert>
    </v-snackbar>
  </v-container>
  </div>
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
        snackbar:true,
        events_receiving_queue: [],
        time_before: null,
        reprocessing: false,
        search_alta: null,
        alerts:[],
        statusTransactionCatalogs:null
      }
    },
    computed:{
      idEventQueue(){
        return this.$store.state.altas_view_more_event_queue
      }
    },
    watch:{
      idEventQueue(newIdEvent){
        if (newIdEvent == null) {
          this.getEventReceivingQueue()
        }
      }
    },
    components: {
      WatchMoreEventQueue: () => import('../components/WatchMoreEventQueue.vue'),
      QuickAltasInfo: () => import('../components/QuickAltasInfo.vue')
    },
    created: function(){
      if (this.$route.params.idEventQueue) {
        this.viewMoreEventQueue(this.$route.params.idEventQueue)
      }
    },
    mounted: function () {
      var body = new Object()
      body.database = 'moodle_4_api_ju'
      this.getEventReceivingQueue()
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
      axios.post("http://192.168.0.135:3001/get_status_transaction_catalog").then((res)=>{
        this.statusTransactionCatalogs = res.data
      })
      setInterval(() => {
        if (this.alerts.length < 5) {
          var objToPush = new Object()
          objToPush.id = (Math.random() * (1000 - 1) + 1).toFixed(0);
          this.alerts.push(objToPush)
        }
      }, 1000);
    },
    methods: {
      getEventReceivingQueue(){
        var body = new Object()
        body.database = 'moodle_4_api_ju'
        axios.post("http://192.168.0.135:3001/get_all_event_receiving_queue", body).then((res) => {
          this.events_receiving_queue = res.data
        })
      },
      viewMoreEventQueue(item) {
        this.$router.push({name:'altas',params:{idEventQueue:item}}).then().catch(()=>{})
        this.$store.commit('altas_view_more_event_queue_selected', item)
      },
      async retry() {
        this.reprocessing = true
        await axios.post("http://ubuntu20-04.ctdesarrollo.org/josue.ubilla/sign-up-user/manual_reprocess").then(()=>{
          this.getEventReceivingQueue()
          this.reprocessing = false
        })
      },
      transformDate(date) {
        return moment.utc(date).format('DD/MM/YYYY h:mm:ss')
      },
    }
  }
</script>