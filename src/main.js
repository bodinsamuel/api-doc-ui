// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import VueHighlightJS from 'vue-highlightjs';
import 'highlight.js/styles/github-gist.css';

Vue.config.productionTip = false;

Vue.use(VueHighlightJS);

import VueMarkdown from 'vue-markdown';
Vue.component('vue-markdown', VueMarkdown);

import TagItem from '@/components/TagItem';
Vue.component('TagItem', TagItem);

import slugify from 'slugify';
slugify.extend({ '/': '-' });
slugify.extend({ '{': '-' });
slugify.extend({ '}': '-' });
Vue.filter('slugify', function(value) {
  if (!value) {
    return '';
  }
  return slugify(value);
});

// Default options for configuration
const defaults = {
  file: null,
  baseUrl: '/',
};

export default (args) => {
  const config = Object.assign({}, defaults, args);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router: router(config.baseUrl),
    store,
    components: { App },
    template: '<App/>',
    created() {
      this.load();
    },
    methods: {
      load() {
        this.$store.dispatch('Schema/fetch', {
          url: config.file,
        });
      },
    },
  });
};
