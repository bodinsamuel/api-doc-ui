<template>
  <aside class="sidebar" v-if="schema" :class="{ 'is-open': menu }">
    <div class="inner">
      <div class="brand" :class="{ 'is-big': currentRoute.name === 'Home' && screen === 'desktop' }">
        <img :src="logo" alt="logo" class="logo" />
        <div>
          <h1 class="title">{{ schema.info.title }}</h1>
          <p class="subtitle">
            {{ schema.info.version }}
          </p>
        </div>
      </div>
      <nav>
        <div class="nav-collection">
          <router-link :to="{ name: 'Home' }" class="nav-item is-main is-home">Home</router-link>
          <router-link v-if="hasAuthentication" :to="{ name: 'Authentication' }" class="nav-item is-main">Authentication</router-link>
        </div>

        <div class="nav-collection">
          <div class="nav-header">Endpoints</div>
          <div class="nav-children">
            <div v-for="(tag, key) in tags" :key="key" v-if="tag.name !== 'global'">
              <router-link  :to="{ name: 'Tag', params: { name: tag.__slug }}" class="nav-item">{{ tag.name }}</router-link>

              <div v-if="((currentRoute.name === 'TagEndpoint' || currentRoute.name === 'Tag') && currentRoute.params.name === tag.__slug) && tagEndpoint && tagEndpoint.length > 0"
                class="nav-children u-pb20">
                <router-link v-for="(endpoint, key) in tagEndpoint" :key="key"
                  :to="{ name: 'TagEndpoint', params: { name: tag.__slug, endpoint: endpoint.slug  }}"
                  :title="endpoint.path"
                  class="nav-item is-path">{{ endpoint.path }}</router-link>
              </div>

            </div>
          </div>

          <div v-if="tagGlobal" class="nav-children u-pb20">
            <router-link v-for="(endpoint, key) in tagGlobal" :key="key" :to="{ name: 'TagEndpoint', params: { name: 'global', endpoint: endpoint.slug  }}" class="nav-item is-path" :title="endpoint.__path">{{ endpoint.path }}</router-link>
          </div>

        </div>
      </nav>
    </div>!
  </aside>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    currentRoute() {
      return this.$route;
    },
    logo() {
      if (this.schema.info['x-logo']) {
        return this.schema.info['x-logo'].url;
      }
      return '';
    },
    hasAuthentication() {
      return this.$store.state.Schema.hasAuthentication;
    },
    screen() {
      return this.$store.state.screen;
    },
    menu() {
      return this.$store.state.menu;
    },
    schema() {
      return this.$store.state.Schema.current;
    },
    tags() {
      return this.$store.state.Schema.tags;
    },
    tagGlobal() {
      return this.$store.getters['Schema/endpointGroupedByTag']('global');
    },
    tagEndpoint() {
      if (!this.$store.state.Schema.tagCurrent) {
        return;
      }

      const tag = this.$store.getters['Schema/endpointGroupedByTag'](
        this.$store.state.Schema.tagCurrent.name
      );
      return tag;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/vars.scss';

.sidebar {
  font: $font-stack1;
  margin: 0;
  .brand {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    margin: 20px 25px;
    transition: margin 0.3s ease-in-out, min-width 0.3s ease-in-out;
    justify-content: flex-start;
    min-width: 100%;
    align-items: center;
    &.is-big {
      margin: 20px 50px 40px 40px;
      min-width: 100vw;
      .title {
        font-size: 50px;
        line-height: 58px;
      }
      .logo {
        width: 140px;
        margin-right: 10px;
      }
    }
  }
  .logo {
    transition: width 0.3s ease-in-out;
    width: 40px;
  }
  .title {
    transition: font-size 0.3s ease-in-out, line-height 0.3s ease-in-out;
    font-size: 17px;
    line-height: 22px;
    font-weight: 600;
  }
  .subtitle {
    font-size: 16px;
    color: $color-base1;
  }
}
.nav {
  &-collection {
    margin: 20px 0 0 25px;
  }
  &-children {
    margin: 3px 0 0 20px;
  }
  &-header {
    color: $color-base1;
    font-size: $font-size-s;
    font-weight: 600;
  }
  &-item {
    display: block;
    font-size: $font-size-s;
    color: $color-base2;
    line-height: 28px;
    text-transform: capitalize;
    white-space: pre;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      text-decoration: none;
      color: $color-base;
    }
    &.router-link-active:not(.is-home),
    &.router-link-exact-active {
      font-weight: 600;
      color: $color-base;
    }
    &.is-path {
      font-size: $font-size-xs;
      &.router-link-exact-active {
        font-weight: 600;
        color: $color-base;
        &:before {
          content: ' ';
          border-radius: 50%;
          background-color: $color-blue-light;
          display: inline-block;
          height: 6px;
          width: 6px;
          vertical-align: middle;
          margin: -5px 5px 0 0;
        }
      }
    }
    &.is-main {
      font-size: $font-size-s;
      line-height: 30px;
    }
  }
}

@media (max-width: $bp-md) {
  .sidebar {
    position: absolute;
    height: 100vh;
    background: white;
    padding: 0 10px 0 0;
    transform: translate3d(-100%, 0, 0);
    box-shadow: none;
    transition: transform 0.3s ease-out;
    z-index: 1;
    &.is-open {
      transform: translate3d(0, 0, 0);
      box-shadow: 0 0 92px 10px rgba(0, 0, 0, 0.2);
    }
    .inner {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
