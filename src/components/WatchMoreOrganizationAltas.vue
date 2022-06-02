<template>
    <v-dialog v-model="dialog" max-width="360" @click:outside="removeSelectedOrganization()">
        <v-card>
            <v-card-title>
                {{organization != null ? organization.name : ''}}
            </v-card-title>
            <v-card-text>
                <p>
                    <b>
                        Id:
                    </b>
                    <span>
                        {{organization != null ? organization.id : ''}}
                    </span>
                </p>
                <p>
                    <b>
                        Name:
                    </b>
                    <span>
                        {{organization != null ? organization.name : ''}}
                    </span>
                </p>
                <p>
                    <b>
                        Full path:
                    </b>
                    <span>
                        {{organization != null ? organization.origin : ''}}
                        {{organization != null ? organization.rest_path : ''}}
                    </span>
                </p>
                <p>
                    <b>
                        Token:
                    </b>
                    <span>
                        {{organization != null ? organization.token : ''}}
                    </span>
                </p>
                <p>
                    <b>
                        Additional data:
                    </b>
                    <span>
                        {{organization != null ? organization.additional_data : ''}}
                    </span>
                </p>
                <p>
                    <b>
                        Created at:
                    </b>
                    <span>
                        {{organization != null ? organization.created_at : ''}}
                    </span>
                </p>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return {
            organization:null
        }
    },
    created: function(){
        if(this.dialog){
            this.getOrganization()
        }
    },
    methods:{
        removeSelectedOrganization(){
            this.$router.push({name:'organizationsAltas'}).then().catch(()=>{})
        },
        getOrganization(){
            var body = new Object()
            body.id_organization = this.$route.params.idOrganization
            axios.post("http://192.168.0.135:3001/get_altas_organization_by_id",body).then((res)=>{
                this.organization = res.data
            })
        }
    },
    computed:{
        dialog(){
            return this.$route.params.idOrganization != undefined ? true :false
        }
    },
    watch:{
        dialog(value){
            if(value){
                this.getOrganization()
            }
        }
    }
}
</script>