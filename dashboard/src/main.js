import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import {library} from '@fortawesome/fontawesome-svg-core'
import {faBlender, faUsers, faFileInvoiceDollar, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faBlender, faUsers, faFileInvoiceDollar, faBoxesStacked)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
