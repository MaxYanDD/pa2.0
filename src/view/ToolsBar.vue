<template>
  <div class="toolsbar"   @mousedown.stop.prevent>
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
      <a @click="(e) => this.$Editor.undo()">
        <i class="iconfont icon-undo"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="重做">
      <a @click="() => this.$Editor.redo()">
        <i class="iconfont icon-redo"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="删除">
      <a @click="(e) => this.$Editor.deletCells(e)">
        <i class="iconfont icon-shanchu"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>

    <ToolTip class="tool-item" content="文本框">
      <a @click="() => this.$Editor.insertText()">
        <i class="iconfont icon-twenbenkuang"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="图片">
      <a @click="insertImage">
        <i class="iconfont icon-tupian"></i>
        <!-- <i class="iconfont icon-arrow-drop-down"></i> -->
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="形状">
      <a>
        <i class="iconfont icon-shapes"></i>
        <i class="iconfont icon-arrow-drop-down"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="直线">
      <a @click="() => this.$Editor.insertLine()">
        <i class="iconfont icon-Line-Tool"></i>
        <!-- <i class="iconfont icon-arrow-drop-down"></i> -->
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="表格">
      <a @click="() => this.dialogTableVisible = !this.dialogTableVisible">
        <i class="iconfont icon-table"></i>
      </a>
      <!-- <el-popover placement="bottom" width="200" trigger="click">
        <ul class="tool-create_table">
          <li>
            <p @click="createCostTable">一键生成灯光造价估算表</p>
          </li>
          <li class="divider"></li>
          <li>
            <p>一键生成照明能耗估算表</p>
          </li>
          <li class="divider"></li>
          <li style="padding-top: 5px">
            <span>行:</span>
            <el-input-number
              class="el-input-number-override"
              v-model="tableRow"
              controls-position="right"
              :min="1"
              :max="100"
              size="mini"
            ></el-input-number>
            <span style="margin-left: 5px">列:</span>
            <el-input-number
              class="el-input-number-override"
              v-model="tableCol"
              controls-position="right"
              :min="1"
              :max="100"
              size="mini"
            ></el-input-number>
            <el-button type="primary" class="el-btn-create_table" @click="createTable">插入表格</el-button>
          </li>
        </ul>
        <span slot="reference" class="el-dropdown-link">
          <i class="iconfont icon-table"></i>
        </span>
      </el-popover>-->
    </ToolTip>
    <el-dialog
      title="编辑表格"
      :visible.sync="dialogTableVisible"
      width="1000px"
      :fullscreen="isfullscreen"
      :append-to-body="true"
      class="el-dialog-override"
    >
      <TableEditor />
    </el-dialog>

    <div class="toolbar-separator"></div>

    <!-- 文本框和多边形可用的编辑选项 -->
    <div v-show="currentshape == 'label'" class="modifier">
      <ToolTip class="tool-item" content="填充颜色">
        <a  @mousedown.stop>
          <i class="iconfont icon-tianchong"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="currentShapeStyle.fillColor"
              :show-alpha="true"
              @change="fillColor => changeStyle('fillColor',fillColor)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="边框颜色">
        <a  @mousedown.stop>
          <i class="iconfont icon-pen"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="currentShapeStyle.strokeColor"
              :show-alpha="true"
              @change="strokeColor => changeStyle('strokeColor',strokeColor)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="边框粗细">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          size="mini"
          @command="cmd => changeStyle('strokeWidth',cmd)"
        >
          <span class="el-dropdown-link">
            <i class="iconfont icon-xiantiaocuxi1"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-override">
            <el-dropdown-item
              v-for="item in strokeWidthList"
              :command="item.value"
              :key="item.value"
            >{{item.label}}</el-dropdown-item>
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
          v-model="currentShapeStyle.fontFamily"
          placeholder="请选择"
          class="el-select-override el-ff tool-item"
          popper-class="el-popper-override"
          @change="fontFamily => changeStyle('fontFamily',fontFamily)"
          :popper-append-to-body="false"
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
          v-model="currentShapeStyle.fontSize"
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
        <a onmousedown="event.preventDefault();" @click="()=> this.$Editor.toggleFontStyle('bold')">
          <i class="iconfont icon-font-weight"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="斜体">
        <a
          onmousedown="event.preventDefault();"
          @click="() => this.$Editor.toggleFontStyle('italic')"
        >
          <i class="iconfont icon-Italic"></i>
        </a>
      </ToolTip>
      <ToolTip onmousedown="event.preventDefault();" class="tool-item" content="下划线">
        <a @click="() => this.$Editor.toggleFontStyle('underline')">
          <i class="iconfont icon-Underline"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="字体颜色">
        <a onmousedown="event.preventDefault();">
          <i class="iconfont icon-zimua"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="currentShapeStyle.fontColor"
              :show-alpha="true"
              @change="fontColor => changeStyle('fontColor',fontColor)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <div class="toolbar-separator"></div>
      <ToolTip class="tool-item" content="左对齐">
        <a @click="changeStyle('align','left')">
          <i class="iconfont icon-duiqizuo"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="水平居中">
        <a onmousedown="event.preventDefault();" @click="changeStyle('align','center')">
          <i class="iconfont icon-duiqichuizhi"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="右对齐">
        <a onmousedown="event.preventDefault();" @click="changeStyle('align','right')">
          <i class="iconfont icon-duiqiyou"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="上对齐">
        <a onmousedown="event.preventDefault();" @click="changeStyle('verticalAlign','top')">
          <i class="iconfont icon-top"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="垂直居中对齐">
        <a onmousedown="event.preventDefault();" @click="changeStyle('verticalAlign','middle')">
          <i class="iconfont icon-duiqishuiping"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="下对齐">
        <a onmousedown="event.preventDefault();" @click="changeStyle('verticalAlign','bottom')">
          <i class="iconfont icon-duiqi_xiangshang"></i>
        </a>
      </ToolTip>
      <div class="toolbar-separator"></div>
      <ToolTip class="tool-item" content="行间距(待开发)">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          size="mini"
          @command="cmd => changeStyle('lineHeight',cmd)"
        >
          <span class="el-dropdown-link">
            <i class="iconfont icon-huaban"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-override">
            <el-dropdown-item
              v-for="item in lineHeightList"
              :command="item.value"
              :key="item.value"
            >{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </ToolTip>
    </div>
    <!-- 图片可用的编辑选项 -->
    <div v-show="currentshape == 'image'" class="modifier">
      <ToolTip class="tool-item" content="边框颜色">
        <a>
          <i class="iconfont icon-pen"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="currentShapeStyle.imgBorderColor"
              :show-alpha="true"
              @change="Color => changeStyle('imageBorder',Color)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="边框粗细">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          size="mini"
          @command="cmd => changeStyle('strokeWidth',cmd)"
        >
          <span class="el-dropdown-link">
            <i class="iconfont icon-xiantiaocuxi1"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-override">
            <el-dropdown-item
              v-for="item in strokeWidthList"
              :command="item.value"
              :key="item.value"
            >{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </ToolTip>
      <ToolTip class="tool-item" content="边框线型(待开发)">
        <a>
          <i class="iconfont icon-ic_line_style"></i>
        </a>
      </ToolTip>
      <div class="toolbar-separator"></div>
      <ToolTip class="tool-item" content="更换图片">
        <a @click="changeImage">
          <i class="iconfont icon-zhongzhitupian"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="裁剪(待开发)">
        <a>
          <i class="iconfont icon-caijian"></i>
        </a>
      </ToolTip>
    </div>
    <!-- 线条可用的编辑选项 -->
    <div v-show="currentshape == 'connector'" class="modifier">
      <ToolTip class="tool-item" content="边框颜色">
        <a>
          <i class="iconfont icon-pen"></i>
          <div class="pickerbox">
            <el-color-picker
              v-model="currentShapeStyle.lineColor"
              :show-alpha="true"
              @change="Color => changeStyle('strokeColor',Color)"
            ></el-color-picker>
          </div>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="边框粗细">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          size="mini"
          @command="cmd => changeStyle('strokeWidth',cmd)"
        >
          <span class="el-dropdown-link">
            <i class="iconfont icon-xiantiaocuxi1"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdown-override">
            <el-dropdown-item
              v-for="item in strokeWidthList"
              :command="item.value"
              :key="item.value"
            >{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </ToolTip>
      <ToolTip class="tool-item" content="边框线型(待开发)">
        <a>
          <i class="iconfont icon-ic_line_style"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="线条始点">
        <a>
          <i class="iconfont icon-jiang-right"></i>
        </a>
      </ToolTip>
      <ToolTip class="tool-item" content="线条终点">
        <a>
          <i class="iconfont icon-jiang-copy"></i>
        </a>
      </ToolTip>
    </div>
  </div>
</template>
<script>
import * as mxgraph from 'mxgraph';
import ToolTip from '../components/ToolTip';
import TableEditor from './TableEditor';
import store from '../store';

export default {
  data() {
    return {
      fontFamilyList: [
        {
          value: 'Microsoft YaHei',
          label: '微软雅黑'
        },
        {
          value: 'SimSun',
          label: '宋体'
        },
        {
          value: 'KaiTi',
          label: '楷体'
        },
        {
          value: 'LiSu',
          label: '隶书'
        },
        {
          value: 'YouYuan',
          label: '幼圆'
        },
        {
          value: 'Impact',
          label: 'IMPACT'
        },
        {
          value: 'Arial',
          label: 'Arial'
        },
        {
          value: 'Verdana',
          label: 'Verdana'
        }
      ],
      fontSizeList: [6, 7, 8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96],
      strokeWidthList: [
        {
          value: 1,
          label: '1px'
        },
        {
          value: 2,
          label: '2px'
        },
        {
          value: 3,
          label: '3px'
        },
        {
          value: 4,
          label: '4px'
        },
        {
          value: 8,
          label: '8px'
        },
        {
          value: 12,
          label: '12px'
        },
        {
          value: 16,
          label: '16px'
        },
        {
          value: 24,
          label: '24px'
        }
      ],
      lineHeightList: [
        {
          value: 1,
          label: '1.0'
        },
        {
          value: 1.2,
          label: '1.2'
        },
        {
          value: 1.4,
          label: '1.4'
        },
        {
          value: 1.5,
          label: '1.5'
        },
        {
          value: 1.6,
          label: '1.6'
        },
        {
          value: 1.8,
          label: '1.8'
        },
        {
          value: 2.0,
          label: '2.0'
        },
        {
          value: 3.0,
          label: '3.0'
        }
      ],
      dialogTableVisible: false,
      vertexSelected: false,
      edgeSelected: false,
      isfullscreen: false,
      currentshape: '',
      currentShapeStyle: {
        fontSize: '16',
        fontFamily: '',
        fontColor: '#ffffff',
        fillColor: '#ffffff',
        strokeColor: '#ffffff',
        imgBorderColor: '#ffffff',
        strokeWidth: 0,
        lineColor: '#ffffff'
      },
      oldStyle: {
        strokeColor: '',
        imgBorderColor: ''
      }
    };
  },
  created() {
    this.$bus.$on('updateToolBarStates', this.updateToolBarStates);
  },
  mounted() {},
  methods: {
    updateToolBarStates(state, vertexSelected, edgeSelected) {
      // 获取当前选中mxCell的类型，image(图片),label(文本框和图形),connector(线)
      // TODO 见Format.js 3441行
      if (!state) {
        this.currentshape = '';
        return;
      }

      const { shape, text, style } = state;
      const { fill, stroke, strokewidth } = shape;
      const { fontColor, fontFamily, fontSize, imageBorder, fontStyle } = style;

      // 获取选中mxCell的样式
      this.currentshape = style.shape;
      if (style.shape == 'label') {
        this.currentShapeStyle.strokeColor = stroke || '#fff';
        this.oldStyle.strokeColor = stroke;
      } else if (style.shape == 'image') {
        this.oldStyle.imgBorderColor = imageBorder;
      } else if (style.shape == 'connector') {
        this.currentShapeStyle.lineColor = stroke;
      }

      this.currentShapeStyle.fillColor = fill || '#fff';
      this.currentShapeStyle.strokeWidth = strokewidth;

      this.currentShapeStyle.fontColor = fontColor || '#fff';
      this.currentShapeStyle.fontFamily = fontFamily || 'Arial';
      this.currentShapeStyle.fontSize = fontSize || '16';

      console.log(state);
    },
    changeStyle(style, value) {
      // 设置边框宽度，给定一个默认边框颜色
      if (this.currentshape == 'label' && style == 'strokeWidth' && !this.oldStyle.strokeColor) {
        this.$Editor.changeStyle(['strokeColor', 'strokeWidth'], ['#000000', value]);
        return;
      }

      // 设置边框宽度，给定一个默认边框颜色
      if (this.currentshape == 'image' && style == 'strokeWidth' && !this.oldStyle.imgBorderColor) {
        this.$Editor.changeStyle(['imageBorder', 'strokeWidth'], ['#000000', value]);
        return;
      }

      // 设置边框颜色，给定一个默认边框宽度
      if (style == 'strokeWidth' && value == 'none') {
        this.$Editor.changeStyle('strokeColor', value);
        return;
      }

      if (style == 'lineHeight' && value) {
        this.$Editor.setLineHeight(value);
      }

      this.$Editor.changeStyle(style, value);
    },
    toggleFontStyle(e, style) {
      // e.stopPropagation();
      // e.preventDefault();
      this.$Editor.toggleFontStyle(style);
    },
    insertImage() {
      this.$Editor.keyHandler.setEnabled(false);
      this.$prompt('请输入图片链接', '插入图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
        inputErrorMessage: '图片链接'
      })
        .then(({ value }) => {
          this.$Editor.insertImage(value);
          this.$Editor.keyHandler.setEnabled(true);
        })
        .catch(() => {
          this.$Editor.keyHandler.setEnabled(true);
        });
    },
    changeImage() {
      this.$prompt('请输入图片链接', '更换图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/,
        inputErrorMessage: '图片链接'
      })
        .then(({ value }) => {
          this.$Editor.changeImage(value);
        })
        .catch(() => {});
    },
    createCostTable() {
      console.log('创建估价表');
      return;
      let style = 'text;html=1;strokeColor=#c0c0c0;fillColor=#ffffff;overflow=fill;rounded=0;';
      let width = 200;
      let height = 100;
      let showLabel = null;
      let allowCellsInserted = true;
      let title = 'Table';

      console.log(this.$Editor.activeGraph);
      this.$Editor.createShape(style, width, height, value, title, showLabel, allowCellsInserted);
    }
  },
  components: {
    ToolTip,
    TableEditor
  },
  watch: {
    dialogTableVisible(newValue) {
      this.$Editor.keyHandler.setEnabled(!newValue);
    }
  }
};
</script>

<style lang="scss">
@import '../assets/sass/theme.scss';

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
    .el-dropdown-link {
      box-sizing: border-box;
      display: inline-block;
      cursor: pointer;
      width: 100%;
      height: 100%;
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
.el-dropdown-override {
  .el-dropdown-menu__item {
    font-size: 14px;
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    &:hover {
      background-color: #f5f7fa;
      color: #000;
    }
  }
}
.el-input-number-override {
  display: inline-block;
  width: 60px;
  .el-input {
    .el-input__inner {
      padding: 0 30px 0 3px;
    }
  }
  span {
    width: 15px;
  }
}
.el-dialog-override {
  .el-dialog__body {
    font-size: 16px;
    .jexcel-override {
      font-size: 16px;
    }
  }
  .el-dialog__header {
    border-bottom: 1px solid #cbcbcb;
  }
  .el-dialog__body {
    padding-top: 0;
  }
}

.jexcel-override {
  user-select: none;
}
foreignObject table {
  margin: -1px 0 0 -1px;
}
</style>