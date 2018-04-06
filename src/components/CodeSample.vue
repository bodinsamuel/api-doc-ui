<template>
  <div>
    <div class="highlightjs-toolbar">
      <button v-for="(sample, key) in samples" :key="key"
        :class="{ 'is-active': select === sample.lang }"
        @click="select = sample.lang">{{ sample.lang }}</button>
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
    select: {
      type: String,
      default() {
        return this.samples[0].lang;
      },
    },
  },
  computed: {
    selectToName() {
      if (this.select === 'C#') {
        return 'cs';
      }

      return this.select;
    },

    example() {
      const one = this.samples.find((sample) => {
        return sample.lang === this.select;
      });
      return one.source;
    },
  },
};
</script>
