'use strict';

import Vue from 'vue'
import App from './App.vue'
import Search from './Search.vue'
import Login from './Login.vue'
import Register from './Register.vue'
import VueRouter from 'vue-router'
// import Datetime from 'vue-datetime'
import vueSlider from 'vue-slider-component';


window.steem_lookup_errors = [];

Vue.component('vueSlider', vueSlider);

Vue.use(VueRouter);
// Vue.use(Datetime);

const routes = [
  {
    path: '/',
    name: 'search',
    component: Search
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
];

var Router = new VueRouter({routes});

var vslm = new Vue({
  el: '#app',
  router: Router,
  render: h => h(App),
  components: {
      // datetime: Datetime,
      'vue-slider': vueSlider
  }
});
