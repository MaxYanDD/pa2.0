<template>
  <div class="page-list">
    <div class="shadow"></div>
    <div
      v-for="page in pages"
      :key="page.id"
      v-show="page.id == activeId"
      :ref="page.id"
      class="page-item"
    />
  </div>
</template>

<script>
// import PageItem from '../components/PageItem'
// import { createText } from '../mxgraph'
import Graph from "../mxgraph/Graph";
import themesXML from "../utils/themesXML";
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
    return {};
  },
  components: {},
  created() {
    this.themes = themesXML();
    this.$bus.$on("createText", this.createText);
  },
  methods: {
    createPage() {
      this.graphs = this.pages.map(page => {
        return new Graph(this.$refs[page.id][0], null, null, null, this.themes);
      });
    },
    createText() {
      console.log( this.graphs[this.activeId]);
      this.graphs[this.activeId].createText();
    }
  },
  mounted() {
    this.createPage();
  }
};
</script>

<style lang="scss">
.page-list {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  .page-item {
    width: 100%;
    height: 100%;
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 960px;
    height: 540px;
    box-shadow: 0 1px 5px 1px rgba(60, 64, 67, 0.15);
    transform-origin: 0 0;
  }
}
</style>