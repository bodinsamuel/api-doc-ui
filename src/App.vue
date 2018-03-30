<template>
  <div id="app">
    <transition name="fade-in">
      <div v-if="!loading && !error" class="main">
        <sidebar-view />
        <main>
          <header-view />
          <router-view />
        </main>
      </div>
      <global-error v-if="error" />
    </transition>
    <div v-if="loading">
    </div>
  </div>
</template>

<script>
import HeaderView from '@/layouts/Header';
import SidebarView from '@/layouts/Sidebar';

import GlobalError from '@/components/GlobalError';

export default {
  name: 'App',
  components: {
    HeaderView,
    SidebarView,
    GlobalError,
  },
  head() {
    return {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:600|Open+Sans:400,600' }
      ]
    }
  },
  data() {
    return {
      loading: true
    };
  },
  watch: {
    definition() {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
  },
  computed: {
    definition() {
      return this.$store.state.Schema.current;
    },
    error() {
      return this.$store.state.error;
    },
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      // this.$store.dispatch('Schema/fetch', {
      //   url: '/static/swagger2/petstore.json'
      // });
      this.$store.dispatch('Schema/fetch', {
        url: '/static/swagger2/slack.yaml'
      });

    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/vars.scss';

#app {
  font: $font-stack1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: $color-base;
}
.main {
  display: grid;
  grid-template-columns: 250px 100vh;
  min-height: 100vh;
}

@import '~@/styles/globals.scss';
@import '~@/styles/transitions.scss';
</style>
