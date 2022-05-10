<template>
    <v-container justify-center align-center fluid>
        <v-data-table :headers="headers" :items="events_receiving_queue" class="elevation-1">
            <template v-slot:[`item.calories`]="{ item }">
                <v-chip :color="getColor(item.calories)" dark>
                    {{ item.calories }}
                </v-chip>
            </template>
            <template v-slot:[`item.action`]="{ item }">
                <v-btn text small @click="viewMoreEventQueue(item)">
                    Ver mas
                </v-btn>
            </template>
            <template v-slot:[`item.processed_at`]="{ item }">
              <p v-if="item.processed_at == null" class="ma-0 red--text">No procesado</p>
              <p v-else class="ma-0">
                {{item.processed_at}}
              </p>
            </template>
        </v-data-table>
        <WatchMoreEventQueue />
    </v-container>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        headers: [
          { text: 'Id', value: 'id'},
          { text: 'Attempts', value: 'attempts'},
          { text: 'Created at', value: 'created_at'},
          { text: 'Processed at', value: 'processed_at'},
          { text: 'Event', value:'event_name' },
          { text: 'Status', value:'status_transaction_catalog.name' },
          { text: '', value: 'action', sortable:false}
        ],
        events_receiving_queue:[]
      }
    },
    components:{
      WatchMoreEventQueue: ()=>import('../components/WatchMoreEventQueue.vue')
    },
    mounted: function(){
      var body = new Object()
      body.database = 'moodle_4_api_ju'
      axios.post("http://192.168.0.79:3001/get_all_event_receiving_queue",body).then((res) => {
        this.events_receiving_queue = res.data
      })
    },
    methods:{
      viewMoreEventQueue(item){
        this.$store.commit('altas_view_more_event_queue_selected',item)
      }
    }
  }
</script>