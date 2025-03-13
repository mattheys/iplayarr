import { createApp, reactive } from 'vue'
import App from './App.vue'
import { createVfm } from 'vue-final-modal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import router from './router/router.js';
import './registerServiceWorker'
import 'vue-final-modal/style.css'

library.add(fas)
library.add(fab)

const app = createApp(App);

const authState = reactive({ user : null });
app.provide('authState', authState);

const vfm = createVfm();
app.use(vfm);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app')
