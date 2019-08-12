// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { Loading, Dropdown,DropdownMenu,DropdownItem,Tooltip,ColorPicker,Select,Option,MessageBox,Message,Popover,Button,InputNumber,Dialog,Scrollbar } from 'element-ui'
import './assets/css/reset.css'
import 'font-awesome/css/font-awesome.min.css'
import Editor from './mxgraph/editor'
import 'element-ui/lib/theme-chalk/index.css';
import './utils/EventHandler'

//https://github.com/snokier/v-contextmenu
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

Vue.use(contentmenu) //右键菜单

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
Vue.use(Popover);
Vue.use(Button);
Vue.use(InputNumber);
Vue.use(Dialog);
Vue.use(Scrollbar);
Vue.use(Loading);


Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message  = Message;
Vue.prototype.$loading = Loading.service;

new Vue({
  el: '#app',
  // router,
  components: { App },
  template: '<App/>'
})
