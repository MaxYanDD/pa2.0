<template>
  <div class="thumb-list" v-contextmenu:contextmenu @contextmenu="handleContextMenu">
    <el-scrollbar>
      <draggable
        :list="xmls"
        @start="drag = true"
        @end="dragEnd"
        group="xmllist"
        ghost-class="ghost-thum"
        v-bind="dragOptions"
      >
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <div
            class="thumb-item"
            v-for="(xml,index) in xmls"
            :key="xml.id"
            :class="{active: (index == activeIndex)}"
          >
            <span class="index">{{index*1 + 1}}</span>
            <div
              class="thumb-box"
              @mousedown="changeActive(index)"
              @contextmenu.prevent="changeActive(index)"
            >
              <div class="svg-wrap" :ref="index"></div>
              <div class="thumb-name" style="cursor:pointer" >
                <input :value="xml.title" @input="changePageTitle($event)" />
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </el-scrollbar>

    <el-drawer
      title="选择模板"
      :visible.sync="drawer"
      direction="ltr"
      :append-to-body="true"
      :modal="false"
      class="drawer-override"
      size="760px"
    >
      
      <TempPicker />
      <!-- <div class="draw-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div> -->
    </el-drawer>

    <v-contextmenu ref="contextmenu" class="menu-override-thumb">
      <v-contextmenu-item @click="(e) => this.$bus.$emit('addXml')">新建页面</v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$bus.$emit('copyXml')">复制页面</v-contextmenu-item>
      <v-contextmenu-item divider></v-contextmenu-item>
      <v-contextmenu-item @click="(e) => this.$bus.$emit('deleteActiveXml')">删除页面</v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import TempPicker from './TempPicker'
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
      drag: false,
      drawer:false
    };
  },
  created() {
    this.$bus.$on('modelChange', this.createThumb);
    this.$bus.$on('drawThumb', this.drawThumb);
    this.$bus.$on('toggleDrawer', this.toggleDrawer);
  },
  methods: {
    toggleDrawer(){
      this.drawer = !this.drawer
    },
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
    //创建缩略图
    createThumb(index) {
      index = index || this.activeIndex;
      const graph = this.$Editor.findGraphByIndex(index);
      const pageWidth = graph.pageFormat.width;
      const pageHeight = graph.pageFormat.height;
      const scals = graph.pageScale;
      const { width: thumbWidth, height: thumbHeight } = this.$refs[index][0].getBoundingClientRect();

      let scaleX = thumbWidth / pageWidth;
      this.$refs[index][0].innerHTML = '';
      this.$Editor.copySvgToThumb(graph,scaleX,this.$refs[index][0])
      // this.$Editor.addGraphFragment(this.$refs[index][0], graph, scaleX);
    },
    // 生成缩略图
    drawThumb() {
      let len = this.xmls.length;
      for (let i = 0; i < len; i++) {
        this.createThumb(i);
      }
    },
    dragEnd(e){
      this.drag = false;
      this.changeActive(e.newIndex)
    },
  },
  components: {
    draggable,
    TempPicker 
  },
  computed: {
    xmlList: {
      set(newVal) {
        console.log('set')
        this.$emit('update:xmls', newVal);
      },
      get() {
        return this.xmls;
      }
    },
    dragOptions(){
      return {
        animation: 500,
        disabled: false,
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.thumb-list {
  height: 100%;
  padding-top: 54px;
  overflow-y: hidden;
  .thumb-item {
    display: flex;
    justify-content: flex-start;
    margin: 20px 0 20px 15px;
    user-select:none;
    .index {
      margin-right: 6px;
        color: rgba(0,0,0,.48);
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

    }
  }
}
</style>