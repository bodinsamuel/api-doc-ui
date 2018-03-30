<template>
  <div class="u-p40">
    <h2 class="u-mb30" style="margin-top: 165px;">Introduction</h2>
    <p>{{ schema.info.description }}</p>
    <div>
      <div v-if="schema.externalDocs"><br>
        {{ schema.externalDocs.description }}<br>
        <a :href="schema.externalDocs.url">{{ schema.externalDocs.url }}</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    schema() {
      return this.$store.state.Schema.current;
    }
  },
}
</script>
