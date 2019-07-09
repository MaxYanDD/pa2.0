<template>
  <div class="page-list">
    <div class="shadow"></div>
    <div v-for="page in pages" :key="page.id" v-show="page.id == activeId" :ref="page.id" class="page-item"/>
  </div>
</template>

<script>
// import PageItem from '../components/PageItem'
// import { createText } from '../mxgraph'
import createGraph from "../mxgraph/createGraph";
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
    return {
    };
  },
  components: {},
  created() {
    this.themes = themesXML();
    this.$bus.$on("addText", () => console.log("addTexx"));
  },
  methods: {
    createPage() {
      this.pages.map(page => {
        createGraph(this.$refs[page.id][0], this.themes, page.xml);
      });
    }
  },
  mounted() {
    this.createPage()
  }
};
</script>

<style lang="scss" scoped>
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
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 962px;
    height: 542px;
    border: 1px solid #ccc;
    box-shadow: 0 1px 3px 1px rgba(60,64,67,.15);
  }
}
</style>