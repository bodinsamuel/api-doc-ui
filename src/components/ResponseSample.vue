<template>
  <div>
    <p v-if="response.description">{{ response.description }}</p>
    <pre v-highlightjs><code>{{ example }}</code></pre>
  </div>
</template>

<script>
export default {
  props: {
    response: {
      type: Object
    },
  },
  data() {
    return {
      type: 'application/json'
    };
  },
  computed: {
    example() {
      if (!this.response.examples) {
        return false;
      }
      if (typeof this.response.examples[this.type] === 'undefined') {
        return false;
      }

      return this.response.examples[this.type];
    },
  },
};
</script>
