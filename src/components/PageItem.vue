<template>
  <div class="page-item" ref="item"></div>
</template>
<script>
import * as mxgraph from "mxgraph";
export default {
  props: {
    page: {
      type: Object
    }
  },
  data() {
    return {
      graph: null
    };
  },
  created() {},
  mounted() {
    const {
      mxGraph,
      mxEvent,
      mxCell,
      mxGraphModel,
      mxImage,
      mxGraphView,
      mxEventObject
    } = mxgraph();
    let root = new mxCell();
    root.insert(new mxCell()); // 创建插入图层
    this.graph = new mxGraph(this.$refs["item"], new mxGraphModel(root));
    window.graph.push(this.graph);
    console.log(this.graph);
    // this.graph.background='red';
    // this.graph.view.validateBackground();
    // this.graph.fireEvent(new mxEventObject('backgroundColorChanged'))
    // window.a = this.graph;
    // const img = new mxImage(
    //   "http://www.eltmall.com/source/image/3fe502898421ceed677695385d69b9269982ac9b.860.jpg",
    //   "910",
    //   "511"
    // );

    // this.graph.setBackgroundImage(img);
    // 设置背景图片
    // const img = new mxImage('http://www.eltmall.com/source/image/3fe502898421ceed677695385d69b9269982ac9b.860.jpg','910','511')
    // this.graph.setBackgroundImage(img);
    // window.mxv = new mxGraphView(this.graph);
    // setTimeout(function(){
    //   console.log('执行');
    //   window.mxv.validateBackgroundImage();  // 设置背景图片后如何生效
    // },16)
    // 监听mxCell改变
    // this.model.addListener(mxEvent.CHANGE, function(sender, evt) {
    //   console.log('change',sender,evt)
    // })
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.page-item {
  width: 910px;
  height: 511.875px;
  margin: 10px auto;
  background-color: #fff;
}
</style>