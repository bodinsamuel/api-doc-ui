<template>
  <div>
    <div v-for="(auth) in list" :key="auth.name">
      {{ auth.name }} <span v-if="auth.items.length > 0">(<span v-for="(item) in auth.items" :key="item"><tag-item verb="red">{{ item }}</tag-item></span>)</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    def: {
      type: Array,
    },
  },
  computed: {
    list() {
      return this.def.map((def) => {
        const key = Object.keys(def)[0];
        return { name: key, items: def[key] }
      });
    },
  },
};
</script>
