'use strict';

import Vue from 'vue'
import App from './App.vue'
import Search from './Search.vue'
import Login from './Login.vue'
import VueRouter from 'vue-router'
// import Datetime from 'vue-datetime'
import vueSlider from 'vue-slider-component';


window.steem_lookup_errors = [];

Vue.component('vueSlider', vueSlider);

Vue.use(VueRouter);
// Vue.use(Datetime);

const routes = [
  { path: '/', component: Search },
  { path: '/login', component: Login}
];

var Router = new VueRouter({routes});

new Vue({
  el: '#app',
  router: Router,
  render: h => h(App),
  components: {
      // datetime: Datetime,
      'vue-slider': vueSlider
  }
});
