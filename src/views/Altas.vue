<template>
    <v-container justify-center align-center class="d-flex flex-column">
        <v-img src="../assets/working.jpg" v-if="show" width="500" contain></v-img>
        <v-img src="../assets/Work_from_home.jpg" v-else width="500" contain></v-img>
        <p class="text-h2 text-center my-2">Tabajamos en eso</p>
    </v-container>
</template>

<script>
export default {
    data: () => ({
        show:true
    }),
    mounted: function(){
        var random_boolean = Math.random() < 0.5;
        this.show = random_boolean;
    }
}
</script>