<template>
  <div class="u-m40 container">
    <div class="bloc" style="margin-top: 165px;">
      <h2 class="u-mb30">Introduction</h2>
      <vue-markdown>{{ schema.info.description }}</vue-markdown>
      <div>
        <div v-if="schema.externalDocs"><br>
          {{ schema.externalDocs.description }}<br>
          <a :href="schema.externalDocs.url">{{ schema.externalDocs.url }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    schema() {
      return this.$store.state.Schema.current;
    },
  },
}
</script>
