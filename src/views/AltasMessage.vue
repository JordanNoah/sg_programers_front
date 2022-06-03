<template>
    <v-container fluid fill-height>
        <v-row>
            <v-col cols="12" class="d-flex justify-end">
                <v-btn text small @click="dialog = !dialog"> Añadir email </v-btn>
            </v-col>
            <v-col cols="12">
                <v-data-table :headers="headers" :items="emails" dense>
                    <template v-slot:[`item.actions`]="{ item, index }">
                        <v-btn icon small @click="actionMail(item.id,index)" :color="item.activate ? 'success':''">
                            <v-icon small>mdi-gmail</v-icon>
                        </v-btn>
                        <v-btn icon small @click="updateEmail(item)">
                            <v-icon small>
                                mdi-pencil
                            </v-icon>
                        </v-btn>
                        <v-btn icon small @click="removeEmail(item)">
                            <v-icon small>
                                mdi-delete
                            </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="450" @click:outside="resetEmail()">
            <v-card>
                <v-card-title>
                    <span class="text-h5">Messages</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="message_config.reason" label="Rason*" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="message_config.email" label="Email*"
                                    hint="example of helper text only on focus" required>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="message_config.params" label="Parametros"
                                    hint="example of persistent helper text" persistent-hint></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-switch v-model="message_config.activate" inset
                                    :label="`${message_config.activate ? 'Enviar email':'No enviar email'}`"></v-switch>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Close
                    </v-btn>
                    <v-btn color="blue darken-1" text v-if="message_config.id" @click="update()">
                        Update
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveEmail()" v-else>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            emails: [],
            dialog: false,
            headers: [{
                    text: 'Id',
                    align: 'start',
                    value: 'id'
                },
                {
                    text: 'Reason',
                    align: 'start',
                    value: 'reason'
                },
                {
                    text: 'Email',
                    align: 'start',
                    value: 'email'
                },
                {
                    text: 'Params',
                    align: 'start',
                    value: 'params'
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                }
            ],
            message_config: {
                reason: '',
                email: '',
                params: '',
                activate: false
            }
        }
    },
    mounted: function () {
        this.getEmails()
    },
    methods: {
        getEmails() {
            axios.post("http://192.168.0.135:3001/get_emails").then((res) => {
                this.emails = res.data
            })
        },
        actionMail(idMail, index) {
            var body = new Object()
            body.id_mail = idMail
            axios.post("http://192.168.0.135:3001/activate_email", body).then((res) => {
                if (res.data.status) {
                    this.emails[index]["activate"] = !this.emails[index]["activate"]
                }
            })
        },
        saveEmail() {
            var body = new Object()
            body.mail_config = this.message_config;
            axios.post("http://192.168.0.135:3001/create_mail_config", body).then((res) => {
                var findObject = this.emails.findIndex(x => x.id === res.data.id);
                if (findObject == -1) {
                    this.emails.push(res.data)
                } else {
                    this.emails.splice(findObject, 1, res.data)
                }
                this.resetEmail()
                this.dialog = false
            })
        },
        update() {
            var body = new Object()
            body.mail_config = this.message_config;
            axios.post("http://192.168.0.135:3001/update_mail_by_id", body).then((res) => {
                var findObject = this.emails.findIndex(x => x.id === res.data.id);
                if (findObject == -1) {
                    this.emails.push(res.data)
                } else {
                    this.emails.splice(findObject, 1, res.data)
                }
                this.resetEmail()
                this.dialog = false
            })
        },
        removeEmail(item) {
            var body = new Object()
            body.mail_config = item
            axios.post("http://192.168.0.135:3001/remove_mail_by_id", body).then((res) => {
                var findObject = this.emails.findIndex(x => x.id === item.id);
                if (res.data.status) {
                    this.emails.splice(findObject, 1)
                }
            })
        },
        updateEmail(email) {
            this.message_config = {
                id: email.id,
                reason: email.reason,
                email: email.email,
                params: JSON.stringify(email.params),
                activate: email.activate
            }
            this.dialog = true
        },
        resetEmail() {
            this.message_config = {
                reason: '',
                email: '',
                params: '',
                activate: false
            }
        }
    }
}
</script>