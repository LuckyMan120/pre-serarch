import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import AsyncComputed from 'vue-async-computed'
import { createProvider } from './vue-apollo'

import Gravatar from 'vue-gravatar'
Vue.component('v-gravatar', Gravatar)

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

import VueLuxon from 'vue-luxon'
Vue.use(VueLuxon, {
  input: {
    zone: 'utc',
  },
})

Vue.use(AsyncComputed)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app')
