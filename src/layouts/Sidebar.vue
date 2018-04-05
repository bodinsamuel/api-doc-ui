<template>
  <aside class="sidebar" v-if="schema">
    <div class="brand" :class="{ 'is-big': currentRoute.name === 'Home' }">
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
        <router-link :to="{ name: 'Authentication' }" class="nav-item is-main">Authentication</router-link>
      </div>

      <div class="nav-collection">
        <div class="nav-header">Endpoints</div>
        <div class="nav-children">
          <div v-for="(tag, key) in tags" :key="key">
            <router-link  :to="{ name: 'Tag', params: { name: tag.__slug }}" class="nav-item">{{ tag.name }}</router-link>
            <div v-if="((currentRoute.name === 'TagEndpoint' || currentRoute.name === 'Tag') && currentRoute.params.name === tag.__slug) && tagEndpoint && tagEndpoint.length > 0" class="nav-children u-pb20">
              <router-link v-for="(endpoint, key) in tagEndpoint" :key="key" :to="{ name: 'TagEndpoint', params: { name: tag.__slug, endpoint: endpoint.slug  }}" class="nav-item" :title="endpoint.path">{{ endpoint.path }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script>
import LogoBase from '@/assets/logo.png';

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
      return LogoBase;
    },
    schema() {
      return this.$store.state.Schema.current;
    },
    tags() {
      return this.$store.state.Schema.tags;
    },
    tagEndpoint() {
      if (!this.$store.state.Schema.tagCurrent) {
        return;
      }

      const endpoints = this.$store.getters['Schema/endpointsByTag'](
        this.$store.state.Schema.tagCurrent.name
      );
      const group = {};

      // Group by endpoint url path
      endpoints.map((endpoint) => {
        if (typeof group[endpoint.__path] !== 'undefined') {
          return;
        }
        group[endpoint.__path] = {
          slug: endpoint.__slug,
          path: endpoint.__path,
        };
      });
      return Object.values(group);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/vars.scss';

.sidebar {
  margin: 0;
  .brand {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    margin: 20px 25px;
    transition: margin 0.3s ease-in-out, min-width 0.3s ease-in-out;
    justify-content: flex-start;
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
    font-size: $font-size-base;
    font-weight: 600;
  }
  &-item {
    display: block;
    font-size: $font-size-base;
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
    &.is-main {
      font-size: $font-size-base;
      line-height: 30px;
    }
  }
}
</style>
