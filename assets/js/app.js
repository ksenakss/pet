import '../styles/app.css';
import './polyfills.js';

import { createApp } from 'vue';
import { createPinia } from "pinia";
import mitt from 'mitt';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueTheMask from 'vue-the-mask';
import Vue3Toastify from 'vue3-toastify';

import { makeRouter } from './routes';
import Config from './config.js';
import { registerVuetify } from './plugins/vuetify';

import App from './components/App.vue';
import AppBar from "./components/AppBar.vue";
import AnonAppBar from "./components/AnonAppBar.vue";

export const emitter = mitt();
export const app = createApp(App);
const pinia = createPinia();

app.component('app-bar', AppBar);
app.component('anon-app-bar', AnonAppBar);
app.provide('emitter', emitter);
app.use(VueAxios, axios);
app.use(pinia);
app.use(VueTheMask);
app.use(Vue3Toastify, {
    autoClose: 3000
});
app.config.globalProperties.$axios = axios;

export let router = null;
export function initial(modules = [], themeData) {
    Config.reload().then(() => {
        router = makeRouter(Config.getUser());
        app.use(router);

        const config = {
            ...themeData,
            usePhoneMask: themeData?.usePhoneMask ?? true,
            logoPath: themeData?.logoPath ?? '/images/logo.svg',
            iconPath: themeData?.iconPath ?? '/favicon.ico',
            showNavBarItemsForGuest: themeData?.header?.showNavBarItemsForGuest === true,
        };

        app.provide('themeData', config);
        app.config.globalProperties.$themeData = config;

        // VUETIFY ПОСЛЕ ВСЕГО (как в рабочем проекте)
        registerVuetify(app, themeData);

        router.isReady().then(() => app.mount('#app'));
    });
}

initial([], {
    primaryColor: '#162040',
    logoPath: '/images/logo.svg',
    iconPath: '/favicon.ico'
});
