<template>
  <div
    class="page-list"
    v-contextmenu:contextmenu
    @contextmenu="handleContextMenu"
    @click.stop="hidePopUp"
  >
    <!-- 右键菜单 https://github.com/snokier/v-contextmenu/blob/master/docs/usage.md -->
    <v-contextmenu ref="contextmenu" class="menu-override">
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
      :key="xml.id"
      :ref="xml.id"
      class="page-item"
      v-for="(xml,index) in xmls"
      v-show="index == activeIndex"
    />
  </div>
</template>

<script>
import Graph from '../mxgraph/Graph';
import themesXML from '../utils/themesXML';
import Editor from '../mxgraph/editor';

export default {
  props: {
    xmls: {
      type: Array
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      disableContentMenu: true,
      isSelectionEmpty: ''
    };
  },
  components: {},
  created() {
    this.themes = themesXML();
    this.$bus.$on('reload',this.loadXml)
  },
  methods: {
    createPage() {
      return this.xmls.map(xml => new Graph(xml.id, xml.xml, this.$refs[xml.id][0], null, null, null, this.themes, this.$Editor));
    },
    handleContextMenu() {
      this.isSelectionEmpty = this.$Editor.activeGraph.isSelectionEmpty(); // 右键菜单

      if (!this.$Editor.activeGraph.isSelectionEmpty()) {
        this.disableContentMenu = false;
      } else {
        this.disableContentMenu = true;
        this.$refs.contextmenu.hide();
      }
    },
    newPage() {},
    hidePopUp() {
      this.$refs.contextmenu.hide();
    },
    loadXml(){
      this.$Editor.graphs = null;
      this.$Editor.activeGraph = null;
      this.$Editor.init(this.createPage(), this.activeIndex);
    }
  },
  mounted() {
    this.loadXml();
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
    top: 0;
    left: 0;
    width: 1100px;
    height: 742.5px;
    box-shadow: 0 7px 21px 0 rgba(0,0,0,.12);
    transform-origin: 0 0;
  }
}
</style>