<template>
    <v-container>
        <div class="d-flex">
            <v-hover v-for="item in items" :key="item.name" v-slot="{ hover }">
                <v-card height="122" width="122" @click="goTo(item)" class="mx-1 pa-2 d-flex justify-center align-center" :color="hover ? 'warning' : ''" elevation="0" :class="{'on-hover':hover}">
                    <div style="width:100%;" class="d-flex justify-center flex-column">
                        <v-icon class="mx-1 my-2" :color="$vuetify.theme.dark ? 'white':'indigo darken-4'">
                            {{item.icon}}
                        </v-icon>
                        <p class="text-center text-caption ma-0" :class="$vuetify.theme.dark ? 'white--text':'indigo--text text--darken-4'">
                            {{item.title}}
                        </p>
                    </div>
                </v-card>
            </v-hover>
        </div>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        items: [{
                title: 'Ws Functions',
                name: 'ws function',
                icon: 'fas fa-th-list'
            },
            {
                title: 'Altas de usuarios',
                name: 'altas',
                icon: 'fas fa-people-arrows'
            }
        ],
        selected: null
    }),
    methods:{
        goTo(page){
            // this.$store.commit('addPage',page)
            this.$router.push({name:page.name})
        }
    }
}
</script>