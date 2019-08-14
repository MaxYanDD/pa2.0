<template>
  <div
    class="page-list"
    v-contextmenu:contextmenu
    @contextmenu="handleContextMenu"
    @click.stop="hideContextMenu"
    @mousewheel="wheelHandler($event)"
  >
    <!-- 右键菜单 https://github.com/snokier/v-contextmenu/blob/master/docs/usage.md -->
    <v-contextmenu ref="contextmenu" class="menu-override" :disabled="disableContextMenu">
      <v-contextmenu-item @click="(e) => this.$Editor.selectAll(e)">
        全选
        <span>Ctrl+A</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.deletCells(e)">
        删除
        <span>Delete</span>
      </v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.copy(e)">
        复制
        <span>Ctrl+C</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.cut(e)">
        剪切
        <span>Ctrl+X</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.pasteHere(e)">
        粘贴
        <span>Ctrl+V</span>
      </v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.toggleLock(e)">
        锁定/解锁
        <span>Ctrl+L</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.toFront(e)">
        置于顶层
        <span>Ctrl+up</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$Editor.toBack(e)">
        移至底层
        <span>Ctrl+down</span>
      </v-contextmenu-item>
    </v-contextmenu>

    <!-- 画布阴影 -->
    <div class="shadow"></div>

    <!-- 画布容器 -->
    <div
      v-for="(xml,index) in xmls"
      :data-id="index"
      :key="xml.id"
      :ref="xml.id"
      class="page-item"
      v-show="xml.id == activeXmlId"
    />
  </div>
</template>

<script>
import Graph from '../mxgraph/graph';
import Editor from '../mxgraph/editor';

export default {
  props: {
    xmls: {
      type: Array
    },
    activeXmlId: {
      type: Number,
      default: 0
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      disableContextMenu: true,
      isSelectionEmpty: ''
    };
  },
  components: {},
  created() {
    this.$bus.$on('reload', this.reload);
    this.$bus.$on('addPage', this.addPage);
    this.$bus.$on('disableContextMenu',this.disableContext)
  },
  methods: {
    // 生成Graph实例数组
    createGraphs() {
      return this.xmls.map(xml => {
        return this.$Editor.createGraph(xml,this.$refs[xml.id][0])
      });
    },

    // 处理右键菜单逻辑
    handleContextMenu() {
      this.isSelectionEmpty = this.$Editor.activeGraph.isSelectionEmpty(); // 右键菜单

      if (!this.$Editor.activeGraph.isSelectionEmpty()) {
        this.disableContextMenu = false;
      } else {
        this.disableContextMenu = true;
        this.$refs.contextmenu.hide();
      }
    },

    // 增加一页
    addPage(id, xml, index) {
      const graph = this.$Editor.createGraph({xml,id},this.$refs[id][0])
      this.$Editor.addGraph(graph)
      this.$bus.$emit('changeActive', index);
    },

    // 隐藏右键菜单
    hideContextMenu() {
      this.$refs.contextmenu.hide();
    },
    disableContext(){
      this.disableContextMenu = true;
    },
    enableContext(){
      this.disableContextMenu = false;
    },

    // 初始化编辑器
    initEditor() {
      this.$Editor.graphs = null;
      this.$Editor.activeGraph = null;
      this.$Editor.init(this.createGraphs(), this.activeIndex);
      this.$Editor.undoManager.clear();
    },

    reload() {
      this.$Editor.loadGraphs(this.createGraphs(), this.activeIndex)
    },

    wheelHandler(e){
      if(e.wheelDelta < 0){
        this.$bus.$emit('changeActive', this.activeIndex+1 > this.xmls.length-1 ? this.xmls.length-1 : this.activeIndex+1)
      }else {
        this.$bus.$emit('changeActive', this.activeIndex-1 < 0 ? 0 : this.activeIndex-1)
      }
    }
  },
  mounted() {
    this.initEditor();
  }
};
</script>

<style lang="scss" scoped>
.page-list {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  overflow: hidden;
  .page-item {
    width: 100%;
    height: 100%;
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 1100px;
    height: 742.5px;
    box-shadow: 0 7px 21px 0 rgba(0, 0, 0, 0.12);
    transform-origin: 0 0;
  }
}
</style>