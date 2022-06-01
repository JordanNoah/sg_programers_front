<template>
    <div class="mx-2">
        {{statusTransactionCatalog.name}}: {{total.toFixed(0)}}
    </div>
</template>

<script>
import axios from 'axios'
import gsap from 'gsap'

export default {
    data() {
        return {
            total:0
        }
    },
    props: {
        statusTransactionCatalog: Object
    },
    created:function(){
        var body = new Object()
        body.statusTransactionCatalog = this.statusTransactionCatalog
        axios.post('http://192.168.0.135:3001/get_total_result_by_transaction_catalog',body).then((res)=>{
            gsap.to(this, { duration: 1, total: Number(res.data.totalCount) || 0 })
        })
    }
}
</script>