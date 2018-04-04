<template>
  <div class="u-p40 container">
    <div class="bloc">
      <div v-if="tag.externalDocs" style="float: right;">
        <a :href="tag.externalDocs.url" class="button success" :title="tag.externalDocs.url">Find out more !</a>
      </div>
      <h2 class="u-mb20">{{ tag.name }}</h2>
      <vue-markdown v-if="tag.description" :source="tag.description"></vue-markdown>
    </div>
    <div class="u-mt40">
      <!-- <h3>Endpoints</h3> -->
      <div v-for="(endpoints, path) in endpointsGrouped" :key="path" class="bloc u-mt30 ">
        <h4 class="u-txt-bold u-pb10">{{ path }}</h4>
        <table class="table">
          <tbody>
            <tr v-for="(endpoint, key) in endpoints" :key="key">
              <td>
                <tag-item :verb="endpoint.__verb">{{ endpoint.__verb.toUpperCase() }}</tag-item>
              </td>
              <td>
                <span v-if="endpoint.summary">{{ endpoint.summary }}</span>
                <span v-else class="u-c-grey u-txt-italic">No description...</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    slug() {
      return this.$route.params.name;
    },
    tag() {
      return this.$store.getters['Schema/tagByName'](this.slug);
    },
    endpointsGrouped() {
      const endpoints = this.$store.getters['Schema/endpointsByTag'](this.tag.name);
      const grouped = {};
      // Group by endpoint url path
      endpoints.map((endpoint) => {
        if (typeof grouped[endpoint.__path] === 'undefined') {
          grouped[endpoint.__path] = [];
        }
        grouped[endpoint.__path].push(endpoint);
      });
      return grouped;
    },
  },
}
</script>
