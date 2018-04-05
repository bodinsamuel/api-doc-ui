<template>
  <table class="table">
    <tbody>
      <tr v-for="(endpoint, key) in methods" :key="key" v-if="endpoint.__verb !== 'parameters'">
        <td style="width: 100px;">
          <tag-item :verb="endpoint.__verb">{{ endpoint.__verb.toUpperCase() }}</tag-item>
        </td>
        <td>
          <span v-if="endpoint.summary">{{ endpoint.summary }}</span>
          <span v-else class="u-c-grey u-txt-italic">No description...</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    methods: {
      type: Array,
    },
  },
};
</script>
