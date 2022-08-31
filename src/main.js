import Vue from 'vue'

import ElementUI from 'element-ui'

import '@/styles/index.scss'
import GlobalTable from '@/components/Base/GlobalTable'
import GlobalSearch from '@/components/Base/GlobalSearch'
import GlobalDialog from '@/components/Base/GlobalDialog'

import App from './App.vue'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './directive/dialogDrag'

Vue.use(ElementUI, { size: 'mini' })
Vue.component('GlobalTable', GlobalTable)
Vue.component('GlobalSearch', GlobalSearch)
Vue.component('GlobalDialog', GlobalDialog)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app')
