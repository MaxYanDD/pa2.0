<template>
  <div class="toolsbar">
    <el-tooltip class="tool-item" effect="dark" content="保存" placement="bottom-start">
      <a>
        <i class="iconfont icon-baocun"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="打印" placement="bottom-start">
      <a>
        <i class="iconfont icon-dayin"></i>
      </a>
    </el-tooltip>
    <div class="toolbar-separator"></div>
    <el-tooltip class="tool-item" effect="dark" content="撤销" placement="bottom-start">
      <a>
        <i class="iconfont icon-undo"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="重做" placement="bottom-start">
      <a>
        <i class="iconfont icon-redo"></i>
      </a>
    </el-tooltip>
    <div class="toolbar-separator"></div>
    <el-tooltip class="tool-item" effect="dark" content="选择" placement="bottom-start">
      <a>
        <i class="iconfont icon-shubiaozhizhen"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="文本框" placement="bottom-start">
      <a @click="addText">
        <i class="iconfont icon-twenbenkuang"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="图片" placement="bottom-start">
      <a>
        <i class="iconfont icon-tupian"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="形状" placement="bottom-start">
      <a>
        <i class="iconfont icon-shapes"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="直线" placement="bottom-start">
      <a>
        <i class="iconfont icon-Line-Tool"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="表格" placement="bottom-start">
      <a>
        <i class="iconfont icon-table"></i>
      </a>
    </el-tooltip>
    <div class="toolbar-separator"></div>
    <el-tooltip class="tool-item" effect="dark" content="填充颜色" placement="bottom-start">
      <a>
        <i class="iconfont icon-tianchong"></i>
        <div class="pickerbox">
          <el-color-picker v-model="fillColor"></el-color-picker>
        </div>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="边框颜色" placement="bottom-start">
      <a>
        <i class="iconfont icon-pen"></i>
        <div class="pickerbox">
          <el-color-picker v-model="borderColor"></el-color-picker>
        </div>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="边框粗细" placement="bottom-start">
      <a>
        <i class="iconfont icon-xiantiaocuxi1"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="边框线型" placement="bottom-start">
      <a>
        <i class="iconfont icon-ic_line_style"></i>
      </a>
    </el-tooltip>
    <div class="toolbar-separator"></div>
    <el-tooltip class="tool-item" effect="dark" content="字体" placement="bottom-start">
      <a>
        <i class="iconfont icon-ic_line_style"></i>
      </a>
    </el-tooltip>
    <el-tooltip class="tool-item" effect="dark" content="字号" placement="bottom-start">
      <a>
        <i class="iconfont icon-ic_line_style"></i>
      </a>
    </el-tooltip>
  </div>
</template>
<script>
import * as mxgraph from "mxgraph";
export default {
  data() {
    return {
      fillColor: "#409EFF",
      borderColor: "#409EFF"
    };
  },
  created() {},
  mounted() {},
  methods: {
    addText() {
      this.$bus.$emit("addText");
    }
  }
};
</script>

<style lang="scss">
@import "../assets/sass/theme.scss";
.toolsbar {
  display: flex;
  align-items: center;
  height: 41px;
  border-bottom: 1px solid rgb(203, 203, 203);
  padding: 0 20px;
  .tool-item {
    position: relative;
    display: inline-block;
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    padding: 0 5px;
    margin: 0 4px;
    i {
      font-size: 20px;
      vertical-align: middle;
      color: #606f7b;
    }
    &:hover {
      background-color: #eff8ff;
      i {
        color: #3388ff;
      }
    }
    .pickerbox {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .el-color-picker {
        position: absolute;
        top: 0;
        left: 0;
      }
      .el-color-picker__trigger {
        padding: 0;
        border: none;
        .el-color-picker__color {
          position: absolute;
          left: 2px;
          bottom: 8px;
          border: none;
          width: 28px;
          height: 4px;
        }
      }
    }
  }
  .toolbar-separator {
    border-left: 1px solid #dadce0;
    margin: 0 4px;
    height: 20px;
  }
}
</style>