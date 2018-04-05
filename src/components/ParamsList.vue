<template>
  <div>
    <div v-if="list.length > 0">
      <h6 class="subhead u-mb10">{{ type }} Parameters</h6>
      <table class="table">
        <tbody>
          <tr v-for="(param, key) in list" :key="key">
            <td style="width: 155px;">
              <b>{{ param.name }}</b>
              <div v-if="param.type" class="u-txt-italic">
                <code class="code-inline blue">{{ param.type }} <span v-if="param.format">&lt;{{ param.format }}&gt;</span><span v-if="param.items">&lt;{{ param.items.type }}&gt;</span></code>
              </div>
            </td>
            <td>
              <div>{{ param.description }}</div>
              <div v-if="param.enum">
                Possible values: <tag-item v-for="(item, key) in param.enum" :key="key">{{ item }}</tag-item>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Array,
    },
    type: {
      type: String,
    },
  },
  computed: {
    list() {
      return this.params.filter((param) => {
        return param.in === this.type;
      });
    },
  },
};
</script>
