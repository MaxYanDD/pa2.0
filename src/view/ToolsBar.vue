<template>
  <div class="toolsbar">
    <ToolTip content="保存" class="tool-item">
      <a>
        <i class="iconfont icon-baocun"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="打印">
      <a>
        <i class="iconfont icon-dayin"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="撤销">
      <a>
        <i class="iconfont icon-undo"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="重做">
      <a>
        <i class="iconfont icon-redo"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="选择">
      <a>
        <i class="iconfont icon-shubiaozhizhen"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="文本框">
      <a @click="addText">
        <i class="iconfont icon-twenbenkuang"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="图片">
      <a>
        <i class="iconfont icon-tupian"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="形状">
      <a>
        <i class="iconfont icon-shapes"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="直线">
      <a>
        <i class="iconfont icon-Line-Tool"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="表格">
      <a>
        <i class="iconfont icon-table"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>

    <!-- 文本框和多边形可用的编辑选项 -->
    <div v-show="vertexSelected && !edgeSelected" class="modifier">
      <ToolTip class="tool-item" content="填充颜色">
        <a>
          <i class="iconfont icon-tianchong"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="fillColor"
              @change="fillColor => changeStyle('fillColor',fillColor)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="边框颜色">
        <a>
          <i class="iconfont icon-pen"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="borderColor"
              @change="strokeColor => changeStyle('strokeColor',strokeColor)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="边框粗细">
        <el-dropdown trigger="click" placement="bottom-start" size="mini" @command="cmd => changeStyle('strokeWidth',cmd)">
          <span class="el-dropdown-link">
            <i class="iconfont icon-xiantiaocuxi1"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in strokeWidthList" :command="item.value" :key="item.value">{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </ToolTip>
      <ToolTip class="tool-item" content="边框线型">
        <a>
          <i class="iconfont icon-ic_line_style"></i>
        </a>
      </ToolTip>
      <div class="toolbar-separator"></div>
      <ToolTip class="tool-item" content="字体">
        <el-select
          v-model="fontFamily"
          placeholder="请选择"
          class="el-select-override el-ff tool-item"
          popper-class="el-popper-override"
          @change="fontFamily => changeStyle('fontFamily',fontFamily)"
        >
          <el-option
            v-for="item in fontFamilyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :style="{'font-family': item.value}"
          ></el-option>
        </el-select>
      </ToolTip>
      <div class="toolbar-separator"></div>
      <ToolTip class="tool-item" content="字号">
        <el-select
          v-model="fontSize"
          placeholder="12"
          class="el-select-override el-fz tool-item"
          popper-class="el-popper-override"
          @change="fontSize => changeStyle('fontSize',fontSize)"
        >
          <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </ToolTip>
      <div class="toolbar-separator"></div>
      <ToolTip class="tool-item" content="粗体">
        <a>
          <i class="iconfont icon-font-weight"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="斜体">
        <a>
          <i class="iconfont icon-Italic"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="下划线">
        <a>
          <i class="iconfont icon-Underline"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="字体颜色">
        <a>
          <i class="iconfont icon-zimua"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="fontColor"
              @change="fontColor => changeStyle('fontColor',fontColor)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
    </div>
  </div>
</template>
<script>
import * as mxgraph from "mxgraph";
import ToolTip from "../components/ToolTip";
import store from "../store";
export default {
  data() {
    return {
      fillColor: "#000",
      borderColor: "#000",
      fontColor: "#000",
      strokeWidth: 0,
      fontFamilyList: [
        {
          value: "Microsoft YaHei",
          label: "微软雅黑"
        },
        {
          value: "SimSun",
          label: "宋体"
        },
        {
          value: "KaiTi",
          label: "楷体"
        },
        {
          value: "LiSu",
          label: "隶书"
        },
        {
          value: "YouYuan",
          label: "幼圆"
        },
        {
          value: "Impact",
          label: "IMPACT"
        },
        {
          value: "Arial",
          label: "Arial"
        },
        {
          value: "Verdana",
          label: "Verdana"
        }
      ],
      fontSizeList: [
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        14,
        18,
        24,
        30,
        36,
        48,
        60,
        72,
        96
      ],
      fontSize: "",
      fontFamily: "",
      strokeWidthList: [
        {
          value: 1,
          label: "1px"
        },
        {
          value: 2,
          label: "2px"
        },
        {
          value: 3,
          label: "3px"
        },
        {
          value: 4,
          label: "4px"
        },
        {
          value: 8,
          label: "8px"
        },
        {
          value: 12,
          label: "12px"
        },
        {
          value: 16,
          label: "16px"
        },
        {
          value: 24,
          label: "24px"
        }
      ],
      vertexSelected: false,
      edgeSelected: false,
      oldStyle:{
        stroke: '',
        strokewidth: ''
      }
    };
  },
  created() {
    this.$bus.$on("updateToolBarStates", this.updateToolBarStates);
  },
  mounted() {},
  methods: {
    addText(evt) {
      this.$bus.$emit("createText", evt);
    },
    updateToolBarStates(state, vertexSelected, edgeSelected) {
      // 获取当前选择元素的样式，更新ToolBar
      this.vertexSelected = vertexSelected;
      this.edgeSelected = edgeSelected;
      if (state) {
        //选中
        const { shape, text, style } = state;
        const { fill, stroke, strokewidth } = shape;
        this.fillColor = fill || "#fff";
        this.borderColor = stroke || "#000";
        this.oldStyle.stroke = stroke;
        this.oldStyle.strokewidth = strokewidth;

        const { fontColor, fontFamily, fontSize } = style;
        this.fontColor = fontColor || "#000";
        this.fontFamily = fontFamily || "Arial";
        this.fontSize = fontSize || "16";

        // TODO 粗体，斜体，下划线，样式读取
      } else {
        //未选中
      }
      console.log(state);
    },
    changeStyle(style, value) {
      console.log(style, value);
      this.$Editor.changeStyle(style, value);
    }
  },
  components: {
    ToolTip
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
    i {
      font-size: 16px;
      vertical-align: middle;
      color: #606f7b;
      line-height: 32px;
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
          left: 6px;
          bottom: 8px;
          border: none;
          width: 20px;
          height: 4px;
        }
      }
      .el-color-picker__icon {
        display: none;
      }
    }
  }
  .toolbar-separator {
    border-left: 1px solid #dadce0;
    margin: 0 4px;
    height: 20px;
  }
  .el-fz {
    width: 60px;
  }
  .el-ff {
    width: 94px;
  }
  .el-select-override {
    .el-input {
      height: 100%;
    }
    .el-input__inner {
      height: 100%;
      border: none;
      border-radius: 0px;
      font-size: 12px;
      padding-left: 0px;
      padding-right: 0px;
    }
    &:hover {
      .el-input__inner {
        background-color: #eff8ff;
      }
    }
  }
  .modifier {
    height: 41px;
    display: flex;
    align-items: center;
  }
}
.el-popper-override {
  .el-select-dropdown__wrap {
    max-height: 1000px;
  }
}
</style>