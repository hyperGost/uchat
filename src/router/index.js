import Vue from 'vue'
import VueRouter from 'vue-router'
const routes = [
  {
    path:'/',
    component:()=> import('../views/Home')
  },
  {
    name:'Message',
    path:'/message',
    component:()=>import('../views/Message.vue')
  },
  {
    path:"/contacts",
    component:()=> import('../views/Contacts.vue')
  },
  {
    path:"/me",
    component:()=>import('../views/Me.vue')
  },
  {
    path: '/room/:roomId',
    component: ()=> import('../views/PersonalChat.vue')
  },
];
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
Vue.use(VueRouter)
export default router
