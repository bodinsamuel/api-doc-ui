<template>
  <header class="header">
    <show-at :breakpoints="{ medium: 900 }" breakpoint="mediumAndBelow">
      <div>
        <button @click="click">
          <i class="icon">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
              <g>
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
              </g>
            </svg>
          </i>
          <div class="title">
            {{ schema.info.title }} <span class="u-c-grey version">{{ schema.info.version }}</span>
          </div>
        </button>
      </div>
    </show-at>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import { showAt, hideAt } from 'vue-breakpoints';

export default {
  components: { hideAt, showAt },
  computed: {
    schema() {
      return this.$store.state.Schema.current;
    },
  },
  methods: {
    click() {
      this.$store.commit('toggleMenu', 'open');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@/styles/vars.scss';

.header {
  padding: 10px 40px;
  .title {
    font-size: 19px;
    vertical-align: top;
    line-height: 28px;
    margin: 0 10px;
    display: inline-block;
  }
  .version {
    font-size: 16px;
  }
}
@media (max-width: $bp-xs) {
  .header {
    padding: 10px 20px;
  }
}
@media (min-width: $bp-xs) and (max-width: $bp-sm) {
  .header {
    padding: 10px 30px;
  }
}
</style>
