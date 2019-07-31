<template>
  <div class="page-list" v-contextmenu:contextmenu @contextmenu="handleContextMenu">
      
    <!-- 右键菜单 https://github.com/snokier/v-contextmenu/blob/master/docs/usage.md -->
    <v-contextmenu ref="contextmenu" class="menu-override">
      <v-contextmenu-item  @click="(e) => this.$Editor.selectAll(e)">
        全选
        <span>Ctrl+A</span>
      </v-contextmenu-item>
      <v-contextmenu-item v-show="!isSelectionEmpty" @click="(e) => this.$Editor.deletCells(e)">
        删除
        <span>Delete</span>
      </v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item v-show="!isSelectionEmpty" @click="(e) => this.$Editor.copy(e)">
        复制
        <span>Ctrl+C</span>
      </v-contextmenu-item>
      <v-contextmenu-item v-show="!isSelectionEmpty" @click="(e) => this.$Editor.cut(e)">
        剪切
        <span>Ctrl+X</span>
      </v-contextmenu-item>
      <v-contextmenu-item v-show="isSelectionEmpty" @click="(e) => this.$Editor.pasteHere(e)">
        粘贴
        <span>Ctrl+V</span>
      </v-contextmenu-item>
      <v-contextmenu-item v-show="!isSelectionEmpty" divider></v-contextmenu-item>
      <v-contextmenu-item v-show="!isSelectionEmpty" @click="(e) => this.$Editor.toFront(e)">
        置于顶层
        <span>Ctrl+up</span>
      </v-contextmenu-item>
      <v-contextmenu-item v-show="!isSelectionEmpty"  @click="(e) => this.$Editor.toBack(e)">
        移至底层
        <span>Ctrl+down</span>
      </v-contextmenu-item>
    </v-contextmenu>

    <!-- 画布阴影 -->
    <div class="shadow"></div>
    <!-- 画布容器 -->
    <div
      :key="page.id"
      :ref="page.id"
      class="page-item"
      v-for="page in pages"
      v-show="page.id == activeId"
    />
  </div>
</template>

<script>
import Graph from '../mxgraph/Graph';
import themesXML from '../utils/themesXML';
import Editor from '../mxgraph/editor';

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
      disableContentMenu: true,
      isSelectionEmpty: ''
    };
  },
  components: {},
  created() {
    this.themes = themesXML();
  },
  methods: {
    createPage() {
      return this.pages.map(page => new Graph(this.$refs[page.id][0], null, null, null, this.themes));
    },
    handleContextMenu() {
      this.isSelectionEmpty = this.$Editor.activeGraph.isSelectionEmpty();

      if (!this.$Editor.activeGraph.isSelectionEmpty()) {
        this.disableContentMenu = false;
      } else {
        this.disableContentMenu = true;
        this.$refs.contextmenu.hide();
      }
    }
  },
  mounted() {
    this.$Editor.init(this.createPage(), this.activeId);
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
.menu-override {
  font-size: 16px;
  width: 200px;
  li span {
    float: right;
    font-size: 14px;
    color: #808080;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1;
  }
  .v-contextmenu-item--hover {
      color: #000 !important;
      background-color: #eff8ff;
  }
}
</style>