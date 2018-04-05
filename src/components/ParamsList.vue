<template>
  <div>
    <div v-if="list.length > 0">
      <h6 class="subhead u-mb10">{{ type }} Parameters</h6>
      <table class="table">
        <tbody>
          <tr v-for="(param, key) in list" :key="key">
            <td style="width: 175px;">
              <b>{{ param.name }}<span v-if="param.required" class="u-c-red" title="This param is required"> *</span></b>
              <div v-if="param.type" class="u-txt-italic">
                <code class="code-inline blue">{{ param.type }} <span v-if="param.format">&lt;{{ param.format }}&gt;</span><span v-if="param.items">&lt;{{ param.items.type }}&gt;</span></code>
              </div>
            </td>
            <td>
              <div v-if="param.description">{{ param.description }}</div>
              <div v-else class="u-txt-italic u-c-grey">No description...</div>

              <div v-if="param.enum">
                <span class="u-txt-s">Allowed</span> <tag-item v-for="(item, key) in param.enum" :key="key">{{ item }}</tag-item>
              </div>

              <div v-if="param.default">
                <span class="u-txt-s">Default</span> <tag-item>{{ param.default }}</tag-item>
              </div>

              <div v-if="param.minimum && param.maximum">
                <span class="u-txt-s">Range</span> <tag-item>[{{ param.minimum }}, {{ param.maximum }}]</tag-item>
              </div>
              <div v-else-if="param.minimum">
                <span class="u-txt-s">Minimum</span> <tag-item>{{ param.minimum }}</tag-item>
              </div>
              <div v-else-if="param.maximum">
                <span class="u-txt-s">Maximum</span> <tag-item>{{ param.maximum }}</tag-item>
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
      }).sort((a, b) => {
        if (a.required && !b.required) {
          return false;
        }
        return a.name > b.name;
      });
    },
  },
};
</script>
