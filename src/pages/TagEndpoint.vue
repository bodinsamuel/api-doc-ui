<template>
  <div class="u-p40 container">
    <div class="bloc">
      <h2 class="u-mb20"><b>{{ endpoint.path }}</b></h2>
      <methods-list :methods="endpoint.endpoints"></methods-list>
    </div>

    <div class="u-mt60">
      <endpoint-bloc class="bloc u-mt50"
        v-for="(method, key) in endpoint.endpoints" :key="key"
        :def="method"
        :globalParam="endpoint.endpoints.parameters"
        v-if="method.__verb !== 'parameters'"></endpoint-bloc>
    </div>
  </div>
</template>

<script>
import MethodsList from '@/components/MethodsList';
import EndpointBloc from '@/components/EndpointBloc';

export default {
  head() {
    const endpoint = this.endpoint;
    return {
      title: `${endpoint.path} - ${this.schema.info.title} documentation`,
    };
  },
  components: {
    MethodsList,
    EndpointBloc,
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('Schema/tagCurrent', {
      name: to.params.name,
    });
    next();
  },
  created() {
    this.$store.dispatch('Schema/tagCurrent', {
      name: this.$route.params.name,
    });
  },
  computed: {
    schema() {
      return this.$store.state.Schema.current;
    },
    tag() {
      return this.$store.getters['Schema/tagBySlug'](this.$route.params.name);
    },
    endpoint() {
      return this.$store.getters['Schema/endpointGroupedBySlug'](
        this.$route.params.endpoint
      );
    },
  },
  methods: {
    getErrorResponses(method) {
      const responses = method.responses;
      if (!responses || responses.length <= 0) {
        return false;
      }

      return Object.keys(responses)
        .filter((code) => {
          return parseInt(code) >= 400;
        })
        .map((code) => {
          return responses[code];
        });
    },
  },
};
</script>
