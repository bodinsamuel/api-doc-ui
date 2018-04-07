import SwaggerParser from 'swagger-parser';
import slugify from 'slugify';

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
    tags: [],
    tagCurrent: null,
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
    setLoading(state, bool) {
      state.loading = bool;
    },
    setFile(state, file) {
      state.file = file;
    },
    setTagCurrent(state, { name }) {
      state.tagCurrent = this.getters['Schema/tagBySlug'](name);
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
              final.tags &&
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
    tagCurrent({ commit }, { name }) {
      commit('setTagCurrent', { name });
    },
    async fetch({ commit, rootState }, { file }) {
      commit('setFile', file);
      if (!file) {
        return;
      }
      commit('setLoading', true);

      try {
        if (typeof file === 'string') {
          file = await fetch(file);
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
