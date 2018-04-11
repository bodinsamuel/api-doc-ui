<template>
  <div class="container" v-if="endpoint">
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
    const path = this.endpoint ? this.endpoint.path : '';
    return {
      title: `${path} - ${this.schema.info.title} documentation`,
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
    // we watch the value to display a 404 if needed
    // It could happen if an user followed an old link or made a typo or whatever
    this.$store.watch(
      (state) => state.Schema.tagCurrent,
      (newValue) => {
        if (!newValue) {
          this.$store.state.page404 = true;
        }
      }
    );
    this.$store.watch(
      (state) => state.Schema.endpointCurrent,
      (newValue) => {
        if (!newValue) {
          this.$store.state.page404 = true;
        }
      }
    );

    this.$store.dispatch('Schema/tagCurrent', {
      name: this.$route.params.name,
    });
    this.$store.dispatch('Schema/endpointCurrent', {
      name: this.$route.params.endpoint,
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('on update la');
    this.$store.dispatch('Schema/tagCurrent', {
      name: to.params.name,
    });
    this.$store.dispatch('Schema/endpointCurrent', {
      name: to.params.endpoint,
    });
    next();
  },
  computed: {
    schema() {
      return this.$store.state.Schema.current;
    },
    endpoint() {
      return this.$store.state.Schema.endpointCurrent;
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
