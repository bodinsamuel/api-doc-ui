<template>
  <div>
    <p v-if="response.description" class="u-mb10">{{ response.description }}</p>
    <div class="highlightjs-toolbar">
      <button v-for="(produce, key) in mergedProduces" :key="key"
        :class="{ 'is-active': type === produce }"
        @click="type = produce">{{ produce }}</button>
    </div>
    <pre v-highlightjs :key="type"><code>{{ example }}</code></pre>
  </div>
</template>

<script>
const OpenAPISampler = require('openapi-sampler');

export default {
  props: {
    response: {
      type: Object,
    },
    produces: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      type: 'application/json',
    };
  },
  computed: {
    globalProduces() {
      return this.$store.state.Schema.produces;
    },
    mergedProduces() {
      // use a set to easily dedup mime
      const merge =new Set(this.globalProduces)
      merge.add(...this.produces);

      // then convert to array, because vue does not support Map/Set
      return Array.from(merge);
    },
    example() {
      const type = this.type;
      const canJson = this.mergedProduces.includes('application/json') && this.type === 'application/json';

      // build response with schema
      if (this.response.schema && canJson) {
        return OpenAPISampler.sample(this.response.schema, {skipReadOnly: true});
      }

      // use hardcoded sample
      if (!this.response.examples
          || typeof this.response.examples[this.type] === 'undefined') {
        if (canJson) {
          return {};
        }
        return '';
      }

      return this.response.examples[this.type];
    },
  },
};
</script>
