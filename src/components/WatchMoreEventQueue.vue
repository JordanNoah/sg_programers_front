<template>
    <v-dialog v-model="dialog" @click:outside="removeSelectedEvent()">
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                Event queue id:{{$store.state.altas_view_more_event_queue.id}}
            </v-card-title>

            <v-container fluid>
                <v-row justify="space-between">
                    <v-col cols="5">
                        info
                    </v-col>
                    <v-col cols="6">
                        <v-simple-table dense>
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
                                    <tr v-for="item in desserts" :key="item.name">
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.calories }}</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
            </v-container>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                    I accept
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
  export default {
      data () {
          return {
              desserts: [],
          }
      },
    computed:{
        dialog() {
            return this.$store.state.altas_view_more_event_queue != null ? true :false
        }
    },
    mounted:function(){
        var body = new Object()
        body.eventqueue = this.$store.state.altas_view_more_event_queue
        axios.post('http://192.168.0.79:3001/',body)
    },
    methods:{
        removeSelectedEvent(){
            this.$store.commit('altas_view_more_event_queue_removed')
        }
    }
  }
</script>