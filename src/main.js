// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { Dropdown,DropdownMenu,DropdownItem,Tooltip,ColorPicker,Select,Option } from 'element-ui'
import './assets/css/reset.css'
import 'font-awesome/css/font-awesome.min.css'
import Editor from './mxgraph/editor'

const bus = new Vue();
Vue.prototype.$bus = bus
Vue.prototype.$Editor = new Editor(bus)
Vue.config.productionTip = false

// element-ui
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Tooltip);
Vue.use(ColorPicker);
Vue.use(Select);
Vue.use(Option);

new Vue({
  el: '#app',
  // router,
  components: { App },
  template: '<App/>'
})
