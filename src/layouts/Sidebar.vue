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
        <router-link :to="{ name: 'Home' }" class="nav-item is-main">Home</router-link>
        <router-link :to="{ name: 'Authentication' }" class="nav-item is-main">Authentication</router-link>
      </div>

      <div class="nav-collection">
        <div class="nav-header">Endpoints</div>
        <div class="nav-children">
          <a v-for="(path, name) in schema.paths" href="" :key="name"
             class="nav-item">{{ name }}</a>
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
      if (this.schema.info['x-logo'].url) {
        return this.schema.info['x-logo'].url;
      }
      return LogoBase;
    },
    schema() {
      return this.$store.state.Schema.current;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/vars.scss';

.sidebar {
  margin: 0;
  background: #F4F7FA;
  .brand {
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 10px;
    margin: 20px 25px;
    transition: margin .3s ease-in-out, min-width .3s ease-in-out;
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
    transition: width .3s ease-in-out;
    width: 40px;
  }
  .title {
    transition: font-size .3s ease-in-out, line-height .3s ease-in-out;
    font-size: 17px;
    line-height: 22px;
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
    font-size: $font-size-xs;
    font-weight: 600;
  }
  &-item {
    display: block;
    font-size: $font-size-s;
    color: $color-base2;
    &:hover {
      text-decoration: none;
      color: $color-base;
    }
    &.router-link-exact-active {
      font-weight: 600;
      color: $color-base;
    }
    &.is-main {
      font-size: $font-size-base;
      line-height: 25px;
    }
  }
}
</style>
