<template>
  <div class="toolsbar table-toolsbar" @mousedown.stop>
    <ToolTip class="tool-item" content="撤销">
      <a @click="() => this.table.undo()">
        <i class="iconfont icon-undo"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="重做">
      <a @click="() => this.table.redo()">
        <i class="iconfont icon-redo"></i>
      </a>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="字体">
      <el-select
        v-model="currentShapeStyle.fontFamily"
        placeholder="请选择"
        class="el-select-override el-ff tool-item"
        popper-class="el-popper-override"
        @change="fontFamily => changeStyle('font-family',fontFamily)"
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
        @change="fontSize => changeStyle('font-size',fontSize)"
        :popper-append-to-body="false"
      >
        <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="左对齐">
      <a @click.stop="changeStyle('text-align','left')" @mousedown.stop>
        <i class="iconfont icon-left-alignment"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="水平居中">
      <a @mousedown.stop @click="changeStyle('text-align','center')">
        <i class="iconfont icon-Middle"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="右对齐">
      <a @mousedown.stop @click="changeStyle('text-align','right')">
        <i class="iconfont icon-Right-alignment"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="行间距">
      <el-dropdown
        trigger="click"
        placement="bottom-start"
        size="mini"
        @command="cmd => changeStyle('line-height',cmd)"
        :popper-append-to-body="false"
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
    <ToolTip class="tool-item" content="粗体">
      <a @mousedown.stop @click="changeStyle('font-weight','bold')">
        <i class="iconfont icon-font-weight"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="字体颜色">
      <a onmousedown="event.preventDefault();">
        <i class="iconfont icon-zimua"></i>
        <div class="pickerbox">
          <el-color-picker
            v-model="currentShapeStyle.fontColor"
            :show-alpha="true"
            @change="fontColor => changeStyle('color',fontColor)"
          ></el-color-picker>
        </div>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="填充颜色">
      <a onmousedown="event.preventDefault();">
        <i class="iconfont icon-tianchong"></i>
        <div class="pickerbox">
          <el-color-picker
            v-model="currentShapeStyle.bacgroundColor"
            :show-alpha="true"
            @change="bacgroundColor => changeStyle('background-color',bacgroundColor)"
          ></el-color-picker>
        </div>
      </a>
    </ToolTip>
    <!-- <ToolTip class="tool-item" content="边框颜色">
      <a @mousedown.stop>
        <i class="iconfont icon-pen"></i>
        <div class="pickerbox">
          <el-color-picker
            v-model="currentShapeStyle.borderColor"
            :show-alpha="true"
            @change="borderColor => changeBorderColor(borderColor)"
          ></el-color-picker>
        </div>
      </a>
    </ToolTip> -->
  </div>
</template>

<script>
import ToolTip from '../components/ToolTip';
export default {
  props: ['spreadsheet'],
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
      fontSizeList: ['6px', '7px', '8px', '9px', '10px', '11px', '12px', '14px', '18px', '24px', '30px', '36px', '48px', '60px', '72px', '96px'],
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
      currentShapeStyle: {
        fontSize: '16px',
        fontFamily: 'Microsoft YaHei',
        fontColor: '#fff',
        bacgroundColor: '#fff',
        borderColor: '#000'
      }
    };
  },
  components: {
    ToolTip
  },
  computed: {
    table() {
      return this.spreadsheet();
    }
  },
  methods: {
    changeStyle(key, value) {
      console.log(key, value);
      this.table.setStyle(this.table.getHighlighted(), key, value);
    },
    changeBorderColor(value){
      this.table.setStyle(this.table.getHighlighted(), 'border-left-color', value);
      this.table.setStyle(this.table.getHighlighted(), 'border-top-color', value);
    }
  }
};
</script>

<style lang="scss">
.table-toolsbar {
  align-items: center;
  margin: 5px 0;
  border-bottom: none;
  padding: 0;
}
</style>