  <template>
  <div id="app" :class="classes">
    <transition name="fade-in">
      <div v-if="ready && !error" class="main">

        <div class="click-trigger" :class="{ 'show': menu }" @click="clickTrigger"></div>
        <sidebar-view />

        <main class="content">
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
      bodyAttrs: {
        class: this.menu ? 'scroll-lock' : '',
      },
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
  mounted() {
    if (window.matchMedia('(min-width: 900px)').matches) {
      this.$store.commit('setScreen', 'desktop');
    } else {
      this.$store.commit('setScreen', 'mobile');
    }
  },
  computed: {
    classes() {
      const screen = this.screen;
      const route = this.$route.name;
      return [`is-screen-${screen}`, `is-route-${route}`];
    },
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
    screen() {
      return this.$store.state.screen;
    },
    menu() {
      return this.$store.state.menu;
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
    clickTrigger() {
      this.$store.commit('toggleMenu', 'close');
    },
  },
};
</script>

<style lang="scss">
@import '~@/styles/vars.scss';

@media (max-width: $bp-md) {
  .click-trigger {
    position: absolute;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    transition: background-color 0.3s ease-in-out;
    pointer-events: none;
    &.show {
      background-color: rgba(0, 0, 0, 0.5);
      pointer-events: all;
    }
  }
}

@import '~@/styles/globals.scss';
@import '~@/styles/transitions.scss';
</style>
