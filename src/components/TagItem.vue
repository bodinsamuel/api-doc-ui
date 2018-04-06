<template>
  <span class="tag" :class="{ [verb]: verb, bigger: bigger }">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    verb: {
      type: String,
    },
    bigger: {
      type: Boolean,
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~@/styles/vars.scss';

.tag {
  display: inline-block;
  padding: 4px 6px;
  margin: 0 6px;
  line-height: 1;
  vertical-align: top;

  background: $color-grey-lighter;
  color: $color-base;

  font: $font-stack1;
  line-height: 12px;
  font-size: 11px;
  font-weight: bold;

  text-decoration: none;
  border-radius: 3px;
  &.bigger {
    font-size: 15px;
    vertical-align: middle;
  }
  &.get {
    background-color: #1ab6ff;
    color: #fff;
  }
  &.post {
    background-color: #03e03f;
    color: #fff;
  }
  &.put,
  &.patch {
    background-color: #ecd835;
    color: #fff;
  }
  &.delete {
    background-color: #f15524;
    color: #fff;
  }
  &.red {
    color: $color-red-light;
  }
  &.blue {
    color: $color-blue-light;
  }
}
</style>
