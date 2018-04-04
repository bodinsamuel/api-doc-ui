<template>
  <span class="tag" :class="[ verb ]">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    verb: {
      type: String
    }
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
  vertical-align: middle;

  background: $color-grey-light;
  color: $color-base;

  font-size: 10px;
  font-weight: bold;

  text-decoration: none;
  border-radius: 3px;
  &.get {
    background-color: #1AB6FF;
    color: #fff;
  }
  &.post {
    background-color: #03e03f;
    color: #fff;
  }
  &.put, &.patch {
    background-color: #ecd835;
    color: #fff;
  }
  &.delete {
    background-color: #f15524;
    color: #fff;
  }
}
</style>
