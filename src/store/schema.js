import SwaggerParser from 'swagger-parser';

export default {
  namespaced: true,
  state: {
    current: null,
  },
  mutations: {
    setCurrent(state, { parsed }) {
      state.current = parsed;
    },
  },
  actions: {
    async fetch({ commit, rootState }, { url }) {
      try {
        const parsed = await SwaggerParser.dereference(url);
        commit('setCurrent', { parsed });
        console.log(parsed);
      } catch (e) {
        console.error(e);
        if (process.env.NODE_ENV === 'production') {
          rootState.error = 'Please excuse the inconvenience';
        } else {
          rootState.error = e.message;
        }
      }
    },
  },
};
