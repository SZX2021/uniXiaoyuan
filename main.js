import App from './App'
import zdyTabbar from "components/zdy-tabbar.vue"
import listCard from "components/listCard.vue"
import totop from "components/view-top.vue"

// 注册全局组件
Vue.component('zdy-tabbar', zdyTabbar)
Vue.component('listCard', listCard)
Vue.component('totop', totop)

// #ifndef VUE3
import Vue from 'vue'
import store from './store/index.js'
Vue.prototype.$store = store
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif