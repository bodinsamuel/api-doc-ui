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
      <div v-for="(group, path) in endpointsGrouped" :key="path" class="bloc u-mt30 ">
        <h4 class="u-txt-bold u-pb10">
          <router-link :to="{ name: 'TagEndpoint', params: { name: tag.__slug, endpoint: group.slug } }">{{ path }}</router-link>
        </h4>
        <methods-list :methods="group.endpoints"></methods-list>
      </div>
    </div>
  </div>
</template>

<script>
import slugify from 'slugify';

import MethodsList from '@/components/MethodsList';

export default {
  components: {
    MethodsList,
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('Schema/currentTag', {
      name: to.params.name,
    });
    next();
  },
  created() {
    this.$store.dispatch('Schema/currentTag', {
      name: this.$route.params.name,
    });
  },
  computed: {
    tag() {
      return this.$store.getters['Schema/tagBySlug'](this.$route.params.name);
    },
    endpointsGrouped() {
      const endpoints = this.$store.getters['Schema/endpointsByTag'](
        this.tag.name
      );
      const grouped = {};
      // Group by endpoint url path
      endpoints.map((endpoint) => {
        if (typeof grouped[endpoint.__path] === 'undefined') {
          grouped[endpoint.__path] = {
            slug: slugify(endpoint.__path, { lower: true }),
            endpoints: [],
          };
        }
        grouped[endpoint.__path].endpoints.push(endpoint);
      });
      return grouped;
    },
  },
};
</script>
