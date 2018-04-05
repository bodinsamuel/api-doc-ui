<template>
  <div>
    <h3 class="h3 u-mb10">
      {{ title }}
    </h3>

    <div v-if="def.deprecated" class="message warning u-mb40">
      This method is <b>DEPRECATED</b>, please mind that it may not work in the future !
    </div>

    <pre v-highlightjs :key="def.__path"><code class="http">{{ def.__verb.toUpperCase() }} {{ def.__path }}</code></pre>
    <p class="u-mt20" v-if="description">
      {{ description }}
    </p>

    <div v-if="def.security" class="u-mt50">
      <h6 class="subhead u-mb10">Authorizations</h6>
      <security-list :def="def.security"></security-list>
    </div>

    <params-list :params="def.parameters" type="path" class="u-mt50"></params-list>
    <params-list :params="def.parameters" type="header" class="u-mt50"></params-list>
    <params-list :params="def.parameters" type="cookie" class="u-mt50"></params-list>
    <params-list :params="def.parameters" type="query" class="u-mt50"></params-list>
    <params-list :params="def.parameters" type="body" class="u-mt50"></params-list>
    <params-list :params="def.parameters" type="formData" class="u-mt50"></params-list>

    <div class="u-mt50">
      <h6 class="subhead u-mb10">Response</h6>
      <response-sample :response="success" :key="def.__path"></response-sample>
    </div>

    <div v-if="errors.length > 0" class="u-mt50">
      <h6 class="subhead u-mb10">Errors</h6>
      <table class="table">
        <tbody>
          <tr v-for="(error, key) in errors" :key="key">
            <td style="width: 125px;">{{ error.code }}</td>
            <td>{{ error.def.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ParamsList from '@/components/ParamsList';
import ResponseSample from '@/components/ResponseSample';
import SecurityList from '@/components/SecurityList';

export default {
  props: {
    def: {
      type: Object
    },
  },
  components: {
    ParamsList,
    ResponseSample,
    SecurityList,
  },
  computed: {
    title() {
      return this.def.summary || 'Description';
    },

    description() {
      return this.def.description;
    },

    errors() {
      if (typeof this.def.responses === 'undefined') {
        return false;
      }

      const errors = Object.keys(this.def.responses).filter((code) => {
        return parseInt(code) >= 400;
      }).map((code) => {
        return { code, def: this.def.responses[code] };
      });
      return errors;
    },

    success() {
      if (typeof this.def.responses === 'undefined') {
        return { };
      }
      if (typeof this.def.responses['200'] === 'undefined') {
        return { };
      }

      return this.def.responses['200'];
    }
  },
};
</script>
