import { createApp, reactive } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import router from './router/router.js';

library.add(fas)

const app = createApp(App);

const authState = reactive({ user : null });
app.provide('authState', authState);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.mount('#app')
