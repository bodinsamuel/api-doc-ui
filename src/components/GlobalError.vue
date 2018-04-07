<template>
  <div class="u-p40">
    <h1 class="u-mb20">An error occured !</h1>
    <error-list :errors="error"></error-list>
  </div>
</template>

<script>
import ErrorList from '@/components/ErrorList';

export default {
  components: {
    ErrorList,
  },
  computed: {
    error() {
      return this.$store.state.error;
    },
  },
};
</script>
