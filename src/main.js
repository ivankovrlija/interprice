import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue } from 'bootstrap-vue'
import store from './store'
import moment from 'moment'

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD-MMM-YY')
  }
})

Vue.filter('formatSpread', function(value) {
  if (value) {
    if(value > 0){
      return '+' + value + 'bp'
    }else{
      return value
    }
  }
})

Vue.filter('formatYield', function(value) {
  if (value) {
    return parseFloat(value.toFixed(3)) + '%'
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
