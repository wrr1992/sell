import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods';
import seller from './components/seller/seller';
import ratings from './components/ratings/ratings';

import './common/stylus/index.styl';
Vue.use(VueRouter);
Vue.use(VueResource);

const app = Vue.extend(App);
const router = new VueRouter({
  routes: [
    { path: '/',
       component: app,
       children: [
        { path: '/goods', component: goods },
        { path: '/seller', component: seller },
        { path: '/ratings', component: ratings }
      ]
    }
  ]
});

new Vue({ router }).$mount('#app');
