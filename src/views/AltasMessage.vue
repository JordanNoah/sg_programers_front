<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        Id
                    </th>
                    <th class="text-left">
                        Reason
                    </th>
                    <th class="text-left">
                        Email
                    </th>
                    <th class="text-left">
                        Params
                    </th>
                    <th class="text-left">
                        Activated
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in emails" :key="item.name">
                    <td>{{ item.id }}</td>
                    <td>{{ item.reason }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.params }}</td>
                    <td>
                        <v-btn icon small>
                            <v-icon small>mdi-gmail</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return {
            emails:null
        }
    },
    mounted:function(){
        this.getEmails()
    },
    methods:{
        getEmails(){
            axios.post("http://192.168.0.135:3001/get_emails").then((res)=>{
                this.emails = res.data
            })
        }
    }
}
</script>