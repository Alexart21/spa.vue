import {createApp} from "vue";

import App from './App';
import store from './store';
import router from './router';
// import { VueReCaptcha } from 'vue-recaptcha-v3'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faAsterisk} from '@fortawesome/free-solid-svg-icons'
import { faDrupal, faWordpress, faReact, faTelegramPlane, faViber, faWhatsapp} from '@fortawesome/free-brands-svg-icons'

library.add(faCheck, faAsterisk, faDrupal, faWordpress, faReact, faTelegramPlane, faViber, faWhatsapp);
// имей ввиду что иконки free-brands выводяться так <fa-icon :icon="['fab', 'react']" />

createApp(App)
    .use(store)
    .use(router)
    .component('fa-icon', FontAwesomeIcon)
    .mount('#app');

store.dispatch('loadUser');

import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/animate.min.css'