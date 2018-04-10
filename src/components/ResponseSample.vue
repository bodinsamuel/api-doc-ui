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
      if (!this.produces || this.produces.length <= 0) {
        return this.globalProduces;
      }

      return this.produces;
    },
    example() {
      const type = this.type;
      const canJson =
        this.mergedProduces.includes('application/json') &&
        this.type === 'application/json';
      const canXml =
        this.mergedProduces.includes('application/xml') &&
        this.type === 'application/xml';

      // build response with schema
      if (this.response.schema) {
        if (this.response.schema.example) {
          return this.response.schema.example;
        }
        if (canJson) {
          return this.getJson();
        } else if (canXml) {
          return this.getXml();
        }
      }

      // use hardcoded sample
      if (
        !this.response.examples ||
        typeof this.response.examples[this.type] === 'undefined'
      ) {
        if (canJson) {
          return {};
        }
        return '';
      }

      return this.response.examples[this.type];
    },
  },
  methods: {
    getJson() {
      return OpenAPISampler.sample(this.response.schema);
    },

    getXml() {
      return '<xml>Preview not supported right now...</xml>';
    },
  },
};
</script>
