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
      <v-tabs>
        <v-tab to="/altas/main">Altas</v-tab>
        <v-tab to="/altas/organizations">Organizaciones</v-tab>
      </v-tabs>

    <router-view></router-view>

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
export default {
  data() {
    return{
      reprocessing: false,
      statusTransactionCatalogs:null,
      alerts:[]
    }
  },
  components:{
    QuickAltasInfo: () => import('../components/QuickAltasInfo.vue')
  }
}
</script>