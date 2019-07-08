<template>
  <div class="page-list">
    <PageItem v-for="page in pages" :key="page.id" :page="page" v-show="page.id == activeId"/>
  </div>
</template>

<script>
import PageItem from '../components/PageItem'
import { createText } from '../mxgraph'
export default {
  props: {
    pages: {
      type: Array
    },
    activeId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    };
  },
  components: {
    PageItem
  },
  created() {
    this.$bus.$on('addText',() => createText(this.$children[this.activeId].graph));
  },
  methods: {
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.page-list {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>