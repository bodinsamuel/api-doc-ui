<template>
  <div v-if="errors">
    <ul>
      <li v-for="(err, key) in errors" :key="key">
        {{ err.message }}
        <error-list v-if="err.errors" :errors="err.errors"></error-list>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'error-list',
  props: {
    errors: {
      type: Array,
    },
  },
};
</script>
