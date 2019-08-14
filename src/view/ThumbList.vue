<template>
  <div class="thumb-list" v-contextmenu:contextmenu @contextmenu="handleContextMenu">
    <el-scrollbar>
      <div
        class="thumb-item"
        v-for="(xml,index) in xmls"
        :key="xml.id"
        :class="{active: (index == activeIndex)}"
      >
        <span class="index">{{index*1 + 1}}</span>
        <div
          class="thumb-box"
          @click="changeActive(index)"
          @contextmenu.prevent="changeActive(index)"
        >
          <div class="svg-wrap" :ref="index"></div>
          <div class="thumb-name" style="cursor:pointer">
            <input  :value="xml.title" @input="changePageTitle($event)" />
          </div>
        </div>
      </div>
    </el-scrollbar>

    <v-contextmenu ref="contextmenu" class="menu-override-thumb">
      <v-contextmenu-item @click="(e) => this.$bus.$emit('addXml')">新建页面</v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$bus.$emit('deleteActiveXml')">删除页面</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
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
  created() {
    this.$bus.$on('modelChange', this.createThumb);
    this.$bus.$on('drawThumb', this.drawThumb);
  },
  methods: {
    changeActive(index) {
      this.$bus.$emit('changeActive', index);
    },
    changePageTitle(e) {
      this.$bus.$emit('changePageTitle', e.target.value);
    },
    handleContextMenu(e) {
      if (!e.target.classList.contains('thumb-box')) {
        this.$refs.contextmenu.hide();
      }
    },
    //刷新缩略图
    createThumb(index) {
      const graph = this.$Editor.findGraphByIndex(index);
      const pageWidth = graph.pageFormat.width;
      const pageHeight = graph.pageFormat.height;
      const scals = graph.pageScale;
      const { width: thumbWidth, height: thumbHeight } = this.$refs[index][0].getBoundingClientRect();

      let scaleX = thumbWidth / pageWidth;
      this.$refs[index][0].innerHTML = '';
      this.$Editor.addGraphFragment(this.$refs[index][0], graph, scaleX);
    },
    // 生成缩略图
    drawThumb() {
      let len = this.xmls.length;
      for (let i = 0; i < len; i++) {
        this.createThumb(i);
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.thumb-list {
  height: 100%;
  // padding-top: 54px;
  overflow-y: hidden;
  .thumb-item {
    display: flex;
    justify-content: flex-end;
    width: 205px;
    margin: 20px 0;
    .index {
      margin-right: 6px;
      color: #202124;
    }
    .thumb-box {
      box-sizing: content-box;
      width: 150px;
      border: 1px solid #dae1e7;
      .svg-wrap {
        position: relative;

        width: 100%;
        height: 107px;
        overflow: hidden;
        .thumb-svg {
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          cursor: pointer;
        }
      }

      &:hover {
        margin: -1px;
        border-width: 2px;
        border-color: #8795a1;
      }
    }
    .thumb-name {
      height: 22px;
      margin: 0 1px 1px;
      background-color: rgba(230, 230, 230, 0.9);
      input {
        display: block;
        width: 100%;
        background-color: transparent;
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        color: #606f7b;
        outline: none;
        border: none;
      }
    }
    &.active {
      .thumb-box {
        margin: -1px;
        border-width: 2px;
        border-color: #3388ff;
      }
      .index {
        color: #3388ff;
      }
    }
  }
}
</style>