import {createApp} from "vue";

import App from './App';
import store from './store';
import router from './router';
import { VueReCaptcha } from 'vue-recaptcha-v3'
// import JQuery from "jquery";
// let $ = JQuery;

createApp(App)
    .use(store)
    .use(router)
    .use(VueReCaptcha, {
        siteKey: '6LftRl0aAAAAAHJDSCKdThCy1TaS9OwaGNPSgWyC',
        loaderOptions: {
          useRecaptchaNet: true
        }
      })
    .mount('#app');

import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/animate.css';
// import './assets/fontawesome/css/all.min.css';

// let $ = JQuery;
// import './assets/js/bootstrap.bundle.js';
// import './assets/js/jquery.inputmask.bundle.js';
// import './assets/js/wow.min.js';
// import './assets/js/velocity.min.js';
// import './assets/js/velocity.ui.min.js';
// import './assets/js/scripts.js';
