import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';

import Home from '@/pages/Home';
import Authentication from '@/pages/Authentication';

Vue.use(Router);
Vue.use(Meta, {
  keyName: 'head',
  tagIDKeyName: 'vhid',
});

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/authentication',
      name: 'Authentication',
      component: Authentication,
    },
  ],
});
