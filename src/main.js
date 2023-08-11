// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { NavBar, Icon, PullRefresh, List, Cell, Uploader } from 'vant'
import 'vant/lib/nav-bar/style'
import 'vant/lib/icon/style'
import 'vant/lib/pull-refresh/style'
import 'vant/lib/list/style'
import 'vant/lib/cell/style'
import 'vant/lib/uploader/style'

Vue.use(NavBar)
Vue.use(Icon)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Uploader)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
