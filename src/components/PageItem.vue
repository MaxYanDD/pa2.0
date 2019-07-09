<template>
  <div class="page-item" ref="item"></div>
</template>
<script>
import * as mxgraph from "mxgraph"
import { Graph } from '../mxgraph/graph'
export default {
  props: {
    page: {
      type: Object
    },
    themes: {
    }
  },
  data() {
    return {
    };
  },
  created() {},
  mounted() {
    this.graph = new Graph(null, null, null, null, this.themes);
    this.graph.transparentBackground = false;
    
    this.graph.init(this.$refs['item']);
    
    let root = this.graph.view.getDrawPane().ownerSVGElement;
    root.style.position = 'absolute';

    console.log(this.graph);
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.page-item {
  width: 100%;
  height: 100%;
  background-color: #fff;
  
}
</style>