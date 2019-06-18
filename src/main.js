import 'lib-flexible/flexible.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
//import Vant from 'vant'
import axios from 'axios';
Vue.prototype.$axios = axios

Vue.config.productionTip = false
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
