import { createApp } from 'vue'
import App from './App.vue'
import globalMixin from './globalMixin'
import router from './router'
import store from './store'
import './styles/app.scss';


window.api_url = 'https://primemobile.co.il/api_vue/'
const app = createApp({
    extends: App,
  }).use(store).use(router)


import axios from 'axios'
import VueAxios from 'vue-axios'
app.use(VueAxios, axios)

import VueSweetalert2 from 'vue-sweetalert2';

import 'sweetalert2/dist/sweetalert2.min.css';

app.use(VueSweetalert2);


app.mixin(globalMixin)
app.mount('#app')