import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';

import Home from '@/pages/Home';
import Authentication from '@/pages/Authentication';
import Tag from '@/pages/Tag';

Vue.use(Router);
Vue.use(Meta, {
  keyName: 'head',
  tagIDKeyName: 'vhid',
});

const routes = [
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
  {
    path: '/tag/:name',
    name: 'Tag',
    component: Tag,
  },
];

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }

  return { x: 0, y: 0 };
};

export default new Router({
  mode: 'history',
  routes,
  scrollBehavior,
});
