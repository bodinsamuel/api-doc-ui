import SwaggerParser from 'swagger-parser';
import slugify from 'slugify';
import JSYAML from 'js-yaml';

import SpecMinimumCheck from '@/helpers/spec-minimum-check';
import SpecNormalizer from '@/helpers/spec-normalizer';

export default {
  namespaced: true,
  state: {
    loading: false,
    file: null,
    current: null,
    host: null,
    basePath: null,
    baseUrl: null,
    scheme: 'https',
    hasAuthentication: false,
    tags: [{ name: 'global', description: '', __slug: 'global' }],
    tagCurrent: null,
    endpointCurrent: null,
    endpoints: [],
    endpointsGrouped: [],
    produces: [],
  },

  getters: {
    tagBySlug(state) {
      return (name) => {
        return state.tags.find((tag) => tag.__slug === name);
      };
    },
    endpointGroupedBySlug(state) {
      return (name) => {
        return state.endpointsGrouped.find((group) => group.slug === name);
      };
    },
    endpointGroupedByTag(state) {
      return (name) => {
        return state.endpointsGrouped.filter(
          (endpoint) => endpoint.tag === name
        );
      };
    },
  },

  mutations: {
    setLoading(state, bool) {
      state.loading = bool;
    },
    setFile(state, file) {
      state.file = file;
    },
    setTagCurrent(state, { name }) {
      state.tagCurrent = this.getters['Schema/tagBySlug'](name);
    },
    setEndpointCurrent(state, { name }) {
      state.endpointCurrent = this.getters['Schema/endpointGroupedBySlug'](
        name
      );
    },
    setCurrent(state, { parsed }) {
      state.loading = false;

      state.current = parsed;
      state.host = parsed.host || 'localhost';
      state.scheme = parsed.schemes ? parsed.schemes[0] : 'https';
      state.basePath = parsed.basePath || '/';
      state.baseUrl = `${state.scheme}://${state.host}${state.basePath}`;
      state.produces = parsed.produces || [];

      if (state.securityDefinitions) {
        state.hasAuthentication = true;
      }

      if (parsed.tags) {
        state.tags = state.tags.concat(parsed.tags);
        state.tags.forEach((tag) => {
          tag.__slug = slugify(tag.name, { lower: true });
        });
      }

      // Normalizing paths
      const endpoints = [];
      const grouped = {};
      const tags = [].concat(state.tags);
      for (let path in parsed.paths) {
        for (let verb in parsed.paths[path]) {
          const final = parsed.paths[path][verb];
          endpoints.push(final);

          // Prepare group
          if (typeof grouped[final.__slug] === 'undefined') {
            grouped[final.__slug] = {
              slug: final.__slug,
              path: final.__path,
              tag: final.tags[0],
              endpoints: [],
            };
          }

          grouped[final.__slug].endpoints.push(final);
        }
      }

      state.endpoints = endpoints;
      state.endpointsGrouped = Object.values(grouped).sort((a, b) => {
        if (a.path > b.path) {
          return 1;
        } else if (a.path < b.path) {
          return -1;
        }
        return 0;
      });
      state.tags = tags;
    },
  },

  actions: {
    tagCurrent({ commit }, { name }) {
      commit('setTagCurrent', { name });
    },
    endpointCurrent({ commit }, { name }) {
      commit('setEndpointCurrent', { name });
    },
    async fetch({ commit, rootState }, { file }) {
      commit('setFile', file);
      if (!file) {
        return;
      }
      commit('setLoading', true);

      try {
        if (typeof file === 'string') {
          const response = await fetch(file);
          const text = await response.text();

          if (text.startsWith('{')) {
            file = JSON.parse(text);
          } else {
            file = JSYAML.load(text);
          }
        }

        const hasError = await SpecMinimumCheck(file);
        if (hasError) {
          rootState.error = hasError;
          commit('setLoading', false);
          return;
        }
        const parsed = await SwaggerParser.dereference(file);
        const normalized = await SpecNormalizer(parsed);

        commit('setCurrent', { parsed: normalized });
      } catch (e) {
        console.error(e);
        if (process.env.NODE_ENV === 'production') {
          rootState.error = [{ message: 'Please excuse the inconvenience' }];
        } else if (e.message) {
          rootState.error = [{ message: e.message }];
        } else {
          rootState.error = [{ message: e }];
        }
      }
      commit('setLoading', false);
    },
  },
};
