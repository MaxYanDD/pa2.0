<template>
  <div class="toolsbar" @mousedown.prevent="mouseDownHandler">
    <ToolTip content="保存(Ctrl+S)" class="tool-item">
      <a @click="()=>{this.$bus.$emit('save')}">
        <i class="iconfont icon-baocun"></i>
      </a>
    </ToolTip>
    <!-- <ToolTip class="tool-item" content="打印(待开发)">
      <a>
        <i class="iconfont icon-dayin"></i>
      </a>
    </ToolTip> -->
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="撤销(Ctrl+Z)">
      <a @click="(e) => this.$Editor.undo()">
        <i class="iconfont icon-undo"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="重做撤销(Ctrl+Shift+Z)">
      <a @click="() => this.$Editor.redo()">
        <i class="iconfont icon-redo"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="删除">
      <a @click="(e) => this.$Editor.deletCells(e)">
        <i class="iconfont icon-icon-test"></i>
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
    <ToolTip class="tool-item" content="形状（待开发）">
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
    </ToolTip>
    <!-- 编辑表格弹窗 -->
    <el-dialog
      title="编辑表格"
      top="5vh"
      :visible.sync="dialogTableVisible"
      width="90%"
      :fullscreen="isfullscreen"
      :append-to-body="true"
      class="el-dialog-override el-dialog-override-table"
    >
      <TableEditor @close="() => this.dialogTableVisible = !this.dialogTableVisible" />
    </el-dialog>

   

    <!-- 文本框和多边形可用的编辑选项 -->
    <div v-show="currentshape == 'label'">
      <div class="modifier" v-show="isContentEditing">
        <div class="toolbar-separator"></div>
        <ToolTip class="tool-item" content="字体">
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            size="mini"
            @command="(cmd) => {this.$Editor.changFontStyle('fontName',cmd.value);this.currentShapeStyle.fontFamily = cmd.label}"
          >
            <span class="el-dropdown-link">
              {{currentShapeStyle.fontFamily}}
              <i class="iconfont icon-arrow-drop-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="el-dropdown-override">
              <el-dropdown-item
                v-for="item in fontFamilyList"
                :command="item"
                :key="item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </ToolTip>
        <div class="toolbar-separator"></div>
        <ToolTip class="tool-item" content="字号">
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            size="mini"
            @command="(cmd) => {this.$Editor.changFontStyle('fontSize',cmd);this.currentShapeStyle.fontSize = cmd}"
          >
            <span class="el-dropdown-link">
              {{currentShapeStyle.fontSize}}
              <i class="iconfont icon-arrow-drop-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="el-dropdown-override">
              <el-dropdown-item v-for="item in fontSizeList" :command="item" :key="item">{{item}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </ToolTip>
        <div class="toolbar-separator"></div>
        <ToolTip class="tool-item" content="粗体">
          <a
            onmousedown="event.preventDefault();"
            @click="()=> this.$Editor.changFontStyle('bold')"
          >
            <i class="iconfont icon-font-weight"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="斜体">
          <a
            onmousedown="event.preventDefault();"
            @click="() => this.$Editor.changFontStyle('italic')"
          >
            <i class="iconfont icon-Italic"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="下划线">
          <a @click="() => this.$Editor.changFontStyle('underline')">
            <i class="iconfont icon-Underline"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="字体颜色">
          <a onmousedown="event.preventDefault();">
            <i class="iconfont icon-Font-color"></i>
            <div class="pickerbox">
              <el-color-picker
                v-model="currentShapeStyle.fontColor"
                :show-alpha="true"
                @change="fontColor => this.$Editor.changFontStyle('foreColor',fontColor)"
              ></el-color-picker>
            </div>
          </a>
        </ToolTip>
        <div class="toolbar-separator"></div>
        <ToolTip class="tool-item" content="行间距">
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
      <div class="modifier" v-show="!isContentEditing">
        <div class="toolbar-separator"></div>
        <ToolTip class="tool-item" content="填充颜色">
          <a @mousedown.stop>
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
          <a @mousedown.stop>
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
        <ToolTip class="tool-item" content="边框线型(待开发)">
          <a>
            <i class="iconfont icon-ic_line_style"></i>
          </a>
        </ToolTip>
        <div class="toolbar-separator"></div>

        <ToolTip class="tool-item" content="左对齐">
          <a @click="changeStyle('align','left')">
            <i class="iconfont icon-left-alignment"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="水平居中">
          <a onmousedown="event.preventDefault();" @click="changeStyle('align','center')">
            <i class="iconfont icon-Middle"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="右对齐">
          <a onmousedown="event.preventDefault();" @click="changeStyle('align','right')">
            <i class="iconfont icon-Right-alignment"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="上对齐">
          <a onmousedown="event.preventDefault();" @click="changeStyle('verticalAlign','top')">
            <i class="iconfont icon-veraligntop"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="垂直居中对齐">
          <a onmousedown="event.preventDefault();" @click="changeStyle('verticalAlign','middle')">
            <i class="iconfont icon-align-middle"></i>
          </a>
        </ToolTip>
        <ToolTip class="tool-item" content="下对齐">
          <a onmousedown="event.preventDefault();" @click="changeStyle('verticalAlign','bottom')">
            <i class="iconfont icon-align-bottom"></i>
          </a>
        </ToolTip>
      </div>
    </div>
    <!-- 图片可用的编辑选项 -->
    <div v-show="currentshape == 'image'" class="modifier">
       <div class="toolbar-separator"></div>
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
      <!-- <ToolTip class="tool-item" content="裁剪(待开发)">
        <a>
          <i class="iconfont icon-caijian"></i>
        </a>
      </ToolTip> -->
    </div>
    <!-- 线条可用的编辑选项 -->
    <div v-show="currentshape == 'connector'" class="modifier">
       <div class="toolbar-separator"></div>
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
import { getStyle } from '../utils/utils';
export default {
  data() {
    return {
      fontFamilyList: [
        {
          value: '"Microsoft YaHei"',
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
      fontSizeList: [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96],
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
      isContentEditing: false,
      currentShapeStyle: {
        fontSize: '',
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
    this.$bus.$on('updateFontStyle', this.updateFontStyle);
  },
  mounted() {},
  methods: {
    updateToolBarStates(state, vertexSelected, edgeSelected) {
      
      // 获取当前选中mxCell的类型，image(图片),label(文本框和图形),connector(线),table
      // TODO 见Format.js 3441行
      if (!state) {
        this.currentshape = '';
        return;
      } else if (state == 'stopEditing') {
        this.isContentEditing = false;
        return;
      } else if (state == 'changeActive') {
        this.currentshape = '';
        return;
      }
      console.log(state);
      // 是否处于已双击状态
      this.isContentEditing = this.$Editor.activeGraph.cellEditor.isContentEditing();
      this.updateFrameStyle(state);
      this.updateFontStyle();
    },
    // 文本框骨架样式
    updateFrameStyle(state) { 
      if (Object.prototype.toString.call(state) == '[object Object]') {
        const { shape, text, style } = state;
        const { fill, stroke, strokewidth } = shape;
        const { fontColor, fontFamily, fontSize, imageBorder, fontStyle } = style;

        // 获取选中mxCell的样式
        this.currentshape = style.shape;

        if (style.shape == 'label') {
          this.currentShapeStyle.strokeColor = stroke || '#fff';
          this.oldStyle.strokeColor = stroke;
          if (/^\<table/.test(state.cell.value)) {
            this.currentshape = 'table';
          }
        } else if (style.shape == 'image') {
          this.oldStyle.imgBorderColor = imageBorder;
        } else if (style.shape == 'connector') {
          this.currentShapeStyle.lineColor = stroke;
        }

        this.currentShapeStyle.fillColor = fill || '#fff';
        this.currentShapeStyle.strokeWidth = strokewidth;
      }
    },
    updateFontStyle() {
      if (this.isContentEditing) {
        let fontDom = document.getSelection().baseNode.parentNode;
        
        this.currentShapeStyle.fontColor = getStyle(fontDom, 'color') || '#000';
        this.currentShapeStyle.fontFamily = this.findlabel(this.fontFamilyList,getStyle(fontDom, 'fontFamily')) || 'Arial';
        this.currentShapeStyle.fontSize = getStyle(fontDom, 'fontSize').replace('px','') || 16;
      }
    },
    findlabel(data, value) {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].value == value) {
            return data[i].label;
          }
        }
        return null;
      }
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
        return;
      }

      this.$Editor.changeStyle(style, value);
    },
    // 选择图片弹窗
    selectImage(title) {
      this.$Editor.keyHandler.setEnabled(false);
      return this.$prompt('请输入图片链接', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG|svg|SVG)$/,
        inputErrorMessage: '图片链接'
      })
        .then(({ value }) => {
          this.$Editor.keyHandler.setEnabled(true);
          return value;
        })
        .catch(() => {
          this.$Editor.keyHandler.setEnabled(true);
        });
    },
    async insertImage() {
      let value = await this.selectImage('插入图片');
      this.$Editor.insertImage(value);
    },
    async changeImage() {
      let value = await this.selectImage('更换图片');
      this.$Editor.changeImage(value);
    },
    mouseDownHandler(e) {
      e.stopPropagation();
      console.log('mouseDown');
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

<style lang="scss" scoped>
@import '../assets/sass/theme.scss';
.toolsbar {
  display: flex;
  align-items: center;
  height: 41px;
  background-color: #f8f9fa;
  // border-bottom: 1px solid rgb(203, 203, 203);
  padding: 0 20px;
  .tool-item {
    position: relative;
    display: inline-block;
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    font-size: 14px;
    padding: 0 5px;
    margin-left: 4px;
    span {
      color: #000;
    }
    .icon-arrow-drop-down {
      color: #9f9f9f;
    }
    i {
      font-size: 16px;
      vertical-align: middle;
      color: #606f7b;
      line-height: 26px;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }
  }
  .modifier {
    height: 41px;
    display: flex;
    align-items: center;
  }
}
</style>