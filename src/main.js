import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import myToast from './components/MyCom'
import 'muse-ui-loading/dist/muse-ui-loading.css'
import Loading from 'muse-ui-loading'
import  MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import MToast from 'muse-ui-toast'
import 'muse-ui-message/dist/muse-ui-message.css'
import Message from 'muse-ui-message'
Vue.use(myToast)
Vue.use(MuseUI)
Vue.use(MToast)
Vue.use(Message)
Vue.use(Loading)
import header from './components/header'
import footerInput from './components/footerInput'
import privateChat from './components/privateChat.vue'
Vue.use(header)
Vue.use(footerInput)
Vue.use(privateChat)
Vue.component("my-header",header)
Vue.component('my-input',footerInput)
Vue.component('my-private',privateChat)
axios.defaults.baseURL = 'http://myserver.applinzi.com'
//http://127.0.0.1:5050
//http://myserver.applinzi.com
Vue.prototype.axios = axios;
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
