import {createApp} from "vue";

import App from '@/App';
import store from '@/store';
import router from '@/router';
import mdiVue from 'mdi-vue/v3'
// import * as mdijs from '@mdi/js'
import { mdiCheckBold, mdiAsterisk, mdiWordpress, mdiDrupal, mdiReact, mdiCheckAll, mdiDotsCircle, mdiCloudUploadOutline, mdiLogout, mdiAlertCircleOutline, mdiSend } from "@mdi/js";

createApp(App)
    .use(store)
    .use(router)
    .use(mdiVue, {
        icons: {mdiCheckBold, mdiAsterisk, mdiWordpress, mdiDrupal, mdiReact, mdiCheckAll, mdiDotsCircle, mdiCloudUploadOutline, mdiLogout, mdiAlertCircleOutline, mdiSend}
    })
    .mount('#app');

store.commit('setCsrf');
store.dispatch('loadUser');

import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/animate.min.css';
import "mosha-vue-toastify/dist/style.css";