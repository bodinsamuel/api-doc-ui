<template>
  <div class="u-p40">
    <h1 class="u-mb20">An error occured :(</h1>
    <p>{{ error }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    error() {
      return this.$store.state.error;
    },
  },
};
</script>
