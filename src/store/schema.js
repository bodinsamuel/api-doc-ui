import SwaggerParser from 'swagger-parser';

export default {
  namespaced: true,
  state: {
    current: null,
    host: null,
    basePath: null,
    baseUrl: null,
    scheme: 'https',
    tags: [],
    endpoints: [],
  },

  getters: {
    tagByName(state) {
      return (name) => {
        return state.tags.find((tag) => tag.name === name);
      };
    },
    endpointsByTag(state) {
      return (name) => {
        return state.endpoints.filter(
          (endpoint) => endpoint.tags && endpoint.tags.includes(name)
        );
      };
    },
  },

  mutations: {
    setCurrent(state, { parsed }) {
      state.current = parsed;
      state.host = parsed.host || 'localhost';
      state.scheme = parsed.schemes ? parsed.schemes[0] : 'https';
      state.basePath = parsed.basePath || '/';
      state.baseUrl = `${state.scheme}://${state.host}${state.basePath}`;

      if (parsed.tags) {
        state.tags = parsed.tags;
      }
      if (parsed.paths) {
        const endpoints = [];
        for (let path in parsed.paths) {
          for (let verb in parsed.paths[path]) {
            const final = parsed.paths[path][verb];
            final.__verb = verb;
            final.__path = path;
            endpoints.push(final);
          }
        }
        state.endpoints = endpoints;
      }
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
