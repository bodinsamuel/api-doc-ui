<template>
  <div id="app">
    <transition name="fade-in">
      <div v-if="ready && !error" class="main">
        <sidebar-view />
        <main>
          <header-view />
          <router-view v-if="!page404" />
          <page-not-found v-if="page404"/>
        </main>
      </div>
      <global-error v-if="error" />
    </transition>
    <transition name="fade-in">
      <div v-if="file && loading">
        <div class="u-p40">
          <h1 class="u-mb20">Loading...</h1>
        </div>
      </div>
    </transition>
    <div v-if="!file && !loading">
      <div class="u-p40">
        <h1 class="u-mb20">No file specified...</h1>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderView from '@/layouts/Header';
import SidebarView from '@/layouts/Sidebar';

import GlobalError from '@/components/GlobalError';
import PageNotFound from '@/pages/PageNotFound';

export default {
  name: 'App',
  components: {
    HeaderView,
    SidebarView,
    GlobalError,
    PageNotFound,
  },
  head() {
    return {
      title: 'OpenAPI Documentation',
      link: [
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700|Open+Sans:300,400,600',
        },
        {
          rel: 'stylesheet',
          href:
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/atom-one-light.min.css',
        },
      ],
    };
  },
  data() {
    return {
      ready: false,
    };
  },
  watch: {
    definition() {
      setTimeout(() => {
        this.ready = true;
      }, 200);
    },
    $route() {
      // We change the 404 back to false so we can continue navigating
      this.$store.state.page404 = false;
    },
  },
  computed: {
    file() {
      if (!this.$store.state.Schema.file) {
        return false;
      }
      this.load();
      return this.$store.state.Schema.file;
    },
    loading() {
      return this.$store.state.Schema.loading;
    },
    definition() {
      return this.$store.state.Schema.current;
    },
    error() {
      return this.$store.state.error;
    },
    page404() {
      return this.$store.state.page404;
    },
  },
  methods: {
    load() {
      // we display loading only if it's slow
      setTimeout(() => {
        // because a timeout can happen after the load
        // tricks it by rechecking here
        // I could have stored the timeout but hey ... :D
        if (this.definition) {
          this.ready = true;
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss">
@import '~@/styles/vars.scss';

#app {
  font: $font-stack2;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: $color-base;
  background: #f4f7fa;
  min-height: 100vh;
}
.main {
  display: grid;
  grid-template-columns: 250px auto;
  min-height: 100vh;
}

@import '~@/styles/globals.scss';
@import '~@/styles/transitions.scss';
</style>
