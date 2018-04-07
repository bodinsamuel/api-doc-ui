import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';

import Home from '@/pages/Home';
import Authentication from '@/pages/Authentication';
import Tag from '@/pages/Tag';
import TagEndpoint from '@/pages/TagEndpoint';
import PageNotFound from '@/pages/PageNotFound';

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
    path: '/tag/:name/:endpoint',
    name: 'TagEndpoint',
    component: TagEndpoint,
  },
  {
    path: '/tag/:name',
    name: 'Tag',
    component: Tag,
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound,
  },
];

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition;
  }

  return { x: 0, y: 0 };
};

export default (baseUrl) => {
  return new Router({
    base: baseUrl,
    mode: 'history',
    routes,
    scrollBehavior,
  });
};
