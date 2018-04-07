<template>
  <div>
    <div class="highlightjs-toolbar">
      <button v-for="(sample, key) in samples" :key="key"
        :class="{ 'is-active': selected === sample.lang }"
        @click="selected = sample.lang">{{ sample.lang }}</button>
    </div>
    <pre v-highlightjs="example"><code :class="selectToName"></code></pre>
  </div>
</template>

<script>
export default {
  props: {
    samples: {
      type: Array,
    },
    default: {
      type: String,
      default() {
        return 'javascript';
      },
    },
  },
  data() {
    return {
      selected: this.default,
    };
  },
  created() {
    this.init();
  },
  computed: {
    selectToName() {
      if (this.selected === 'C#') {
        return 'cs';
      }

      return this.selected;
    },

    example() {
      const one = this.samples.find((sample) => {
        return sample.lang === this.selected;
      });
      if (!one) {
        return '';
      }
      return one.source;
    },
  },
  methods: {
    init() {
      this.selected =
        this.samples.length > 0 ? this.samples[0].lang : 'javascript';
    },
  },
};
</script>
