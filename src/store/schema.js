import SwaggerParser from 'swagger-parser';
import slugify from 'slugify';

export default {
  namespaced: true,
  state: {
    current: null,
    host: null,
    basePath: null,
    baseUrl: null,
    scheme: 'https',
    tags: [],
    tagCurrent: null,
    endpoints: [],
    endpointsGrouped: [],
  },

  getters: {
    tagBySlug(state) {
      return (name) => {
        return state.tags.find((tag) => tag.__slug === name);
      };
    },
    endpointsByTag(state) {
      return (name) => {
        return state.endpoints.filter(
          (endpoint) => endpoint.tags && endpoint.tags.includes(name)
        );
      };
    },
    endpointBySlug(state) {
      return (name) => {
        return state.endpointsGrouped[name];
      };
    },
  },

  mutations: {
    setCurrentTag(state, { name }) {
      state.tagCurrent = this.getters['Schema/tagBySlug'](name);
      console.log(state, this);
    },
    setCurrent(state, { parsed }) {
      state.current = parsed;
      state.host = parsed.host || 'localhost';
      state.scheme = parsed.schemes ? parsed.schemes[0] : 'https';
      state.basePath = parsed.basePath || '/';
      state.baseUrl = `${state.scheme}://${state.host}${state.basePath}`;

      if (parsed.tags) {
        state.tags = parsed.tags;
        state.tags.forEach((tag) => {
          tag.__slug = slugify(tag.name, { lower: true });
        });
      }

      // Normalizing paths
      if (parsed.paths) {
        const endpoints = [];
        const grouped = {};
        for (let path in parsed.paths) {
          for (let verb in parsed.paths[path]) {
            const final = parsed.paths[path][verb];
            final.__verb = verb;
            final.__path = path;
            final.__slug = slugify(path, { lower: true });
            endpoints.push(final);

            // If a path is tagged but tag has no global definition we push it
            if (
              final.tags.length > 0 &&
              !state.tags.find((tag) => tag.name === final.tags[0])
            ) {
              state.tags.push({
                name: final.tags[0],
                description: '',
                __slug: slugify(final.tags[0], { lower: true }),
              });
            }

            // Move description to summary if possible/needed
            if (
              !final.summary &&
              final.description &&
              final.description.length <= 75
            ) {
              final.summary = final.description;
              final.description = null;
            }

            // Prepare group
            if (typeof grouped[final.__slug] === 'undefined') {
              grouped[final.__slug] = {
                slug: final.__slug,
                path: final.__path,
                endpoints: [],
              };
            }
            grouped[final.__slug].endpoints.push(final);
          }
        }
        state.endpoints = endpoints;
        state.endpointsGrouped = grouped;
      }
    },
  },

  actions: {
    currentTag({ commit }, { name }) {
      commit('setCurrentTag', { name });
    },
    async fetch({ commit, rootState }, { url }) {
      try {
        const parsed = await SwaggerParser.dereference(url);
        commit('setCurrent', { parsed });
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
