import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Wsfunction from '../views/Wsfunction.vue'
import Altas from '../views/Altas.vue'
import Store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'main'
  },
  {
    path:'/home',
    name:'home',
    component:Home
  },
  {
    path:'/wsfunction',
    name:'ws function',
    component:Wsfunction
  },
  {
    path:'/altas/:idEventQueue(\\d+)?',
    name:'altas',
    component:Altas
  },
  {
    path: '*',
    redirect:{name:'home'}
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  Store.commit('addPage',to)
  next()
})
export default router
