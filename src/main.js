// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入阿里巴巴字体图标文件
import './assets/iconfont/iconfont.css'
import { NavBar, Icon, PullRefresh, List, Cell, Uploader, CellGroup, Image as VanImage, ImagePreview, Popover, ActionSheet, Field, Button } from 'vant'
import 'vant/lib/nav-bar/style'
import 'vant/lib/icon/style'
import 'vant/lib/pull-refresh/style'
import 'vant/lib/list/style'
import 'vant/lib/cell/style'
import 'vant/lib/uploader/style'
import 'vant/lib/cell-group/style'
import 'vant/lib/image/style'
import 'vant/lib/image-preview/style'
import 'vant/lib/popover/style'
import 'vant/lib/action-sheet/style'
import 'vant/lib/field/style'
import 'vant/lib/Button/style'

Vue.use(NavBar)
Vue.use(Icon)
Vue.use(PullRefresh)
Vue.use(List)
Vue.use(Cell)
Vue.use(Uploader)
Vue.use(CellGroup)
Vue.use(VanImage)
Vue.use(ImagePreview)
Vue.use(Popover)
Vue.use(ActionSheet)
Vue.use(Field)
Vue.use(Button)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
