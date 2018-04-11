import Vue from 'vue';
import Vuex from 'vuex';

import Schema from './schema.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Schema,
  },
  state: {
    error: false,
    page404: false,
    menu: false,
    screen: 'mobile',
  },
  mutations: {
    setScreen(state, screen) {
      console.log(state, screen);
      state.screen = screen;
    },
    toggleMenu(state, to) {
      state.menu = to === 'open' ? true : false;
    },
  },
});
