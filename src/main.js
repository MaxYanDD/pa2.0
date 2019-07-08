// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { Dropdown,DropdownMenu,DropdownItem,Tooltip,ColorPicker } from 'element-ui'
import vcolorpicker from 'vcolorpicker'
import './assets/css/reset.css'
import 'font-awesome/css/font-awesome.min.css'
// import router from './router'
Vue.prototype.$bus = new Vue()
Vue.config.productionTip = false

// element-ui
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tooltip);
Vue.use(ColorPicker);
window.graph = []
// vcolorpicker
Vue.use(vcolorpicker)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  components: { App },
  template: '<App/>'
})
