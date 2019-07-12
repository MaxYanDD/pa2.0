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
import Graph from '../mxgraph/Graph'
import themesXML from '../utils/themesXML'
import Editor from '../mxgraph/editor'

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
    this.$bus.$on("changeStyle", this.changeStyle)
  },
  watch: {
    activeId(){
      this.switchGraph()
    }
  },
  methods: {
    createPage() {
      return this.pages.map(page => {
        return new Graph(this.$refs[page.id][0], null, null, null, this.themes)
      });
    },
    createText(e) {
      this.$Editor.createText(e);
    },
    changeStyle(style,value){
      console.log(style,value);
    },
    switchGraph() {
      this.$Editor.switchGraph(this.activeId)
    }
  },
  mounted() {
    this.$Editor.init(this.createPage(),this.activeId)
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