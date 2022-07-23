import {createApp} from "vue";

import App from './App';
import store from './store';
import router from './router';
// import { maska } from 'maska';
// import { VueReCaptcha } from 'vue-recaptcha-v3'
createApp(App)
    .use(store)
    .use(router)
    // .use(VueReCaptcha, {
    //     siteKey: '6LftRl0aAAAAAHJDSCKdThCy1TaS9OwaGNPSgWyC',
    //     loaderOptions: {
    //       useRecaptchaNet: true
    //     }
    //   })
    .mount('#app');

import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/animate.min.css';
