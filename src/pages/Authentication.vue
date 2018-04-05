<template>
  <div class="u-p40 container">
    <div class="bloc">
      <h2 class="u-mb20">Authentication</h2>
      <p>All or some endpoints require you to use authentication, like this:</p>

    </div>
    <div class="u-mt20 bloc" v-for="(def, name) in schema.securityDefinitions" :key="name">
      <h3 class="u-mb10"><tag-item bigger>{{ def.type }}</tag-item>{{ name }}</h3>
      <p v-if="def.description">{{ def.description }}</p>
      <p v-else-if="!def.description && def.type === 'oauth2'">
        OAuth 2.0 is a protocol that lets your app request authorization without sending a password.
      </p>

      <div v-if="def.scopes" class="u-mv20">
        <table class="table">
          <thead>
            <th>
              Scope
            </th>
            <th>
              Definitions
            </th>
            <th>
              Associated endpoints
            </th>
          </thead>
          <tbody>
            <tr v-for="(scope, name) in def.scopes" :key="name">
              <td>
                <code class="code-inline">{{ name }}</code>
              </td>
              <td>
                {{ scope }}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="def.in === 'header'">
        You should pass the token in the <code class="code-inline">headers</code>, with a key named <code class="code-inline">{{ def.name }}</code>, like this:
        <pre v-highlightjs="codeHttp(def)"><code class="http"></code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    schema: state => state.Schema.current,
    host: state => state.Schema.host,
    scheme: state => state.Schema.scheme,
    firstEndpoint() {
      const path = Object.keys(this.$store.state.Schema.current.paths)[0];
      const first = this.$store.state.Schema.current.paths[path];
      const verb = Object.keys(first)[0];
      return {
        path,
        verb,
        values: first[verb],
      }
    },
  }),
  methods: {
    codeHttp(def) {
      const endpoint = this.firstEndpoint;
      const schema = this.schema;
      return `${endpoint.verb.toUpperCase()} ${endpoint.path} ${this.scheme.toUpperCase()}/1.1
Host: ${schema.host}
${def.name}: <string>`;
    }
  }
}
</script>
