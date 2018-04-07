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
  },
});
