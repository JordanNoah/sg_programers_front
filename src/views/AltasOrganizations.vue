<template>
    <v-container class="my-3">
        <v-row>
            <v-col v-for="organization in organizations" :key="organization.id" cols="4" @click.stop="watchMoreOrganizations(organization.id)">
                <v-card>
                    <v-card-title>
                        {{organization.name}}
                    </v-card-title>
                    <v-card-subtitle>
                        <p>
                            <b>
                                id
                            </b>
                            <span>
                                {{organization.id}}
                            </span>
                        </p>
                        <p>
                            <b>
                                name
                            </b>
                            <span>
                                {{organization.name}}
                            </span>
                        </p>
                        <p>
                            <b>
                                Full path
                            </b>
                            <span>
                                {{organization.origin}}{{organization.rest_path}}
                            </span>
                        </p>
                        <p>
                            <b>
                                token
                            </b>
                            <span>
                                {{organization.token}}
                            </span>
                        </p>
                        <p>
                            <b>
                                Additional Data
                            </b>
                            <span>
                                {{organization.additional_data}}
                            </span>
                        </p>
                        <p>
                            <b>
                                Created at
                            </b>
                            <span>
                                {{organization.created_at}}
                            </span>
                        </p>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
        <WatchMoreOrganizationAltas />
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data(){
        return{
            organizations:[]
        }
    },
    components:{
        WatchMoreOrganizationAltas: () => import('../components/WatchMoreOrganizationAltas.vue')
    },
    mounted:function(){
        axios.post('http://192.168.0.135:3001/get_altas_organizations').then((res)=>{
            this.organizations = res.data
        })
    },
    methods:{
        watchMoreOrganizations(idOrganization){
            this.$router.push({name:'organizationsAltas',params:{idOrganization:idOrganization}}).then().catch(()=>{})
        }
    }
}
</script>