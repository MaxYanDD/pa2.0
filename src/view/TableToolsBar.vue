<template>
  <div class="toolsbar table-toolsbar" @mousedown.stop>
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
        :popper-append-to-body="false"
      >
        <el-option v-for="item in fontSizeList" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </ToolTip>
    <div class="toolbar-separator"></div>
    <ToolTip class="tool-item" content="左对齐">
      <a @click.stop="changeStyle('align','left')" @mousedown.stop>
        <i class="iconfont icon-duiqi_zuo"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="水平居中">
      <a @mousedown.stop @click="changeStyle('align','center')">
        <i class="iconfont icon-duiqi_zhong"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="右对齐">
      <a @mousedown.stop @click="changeStyle('align','right')">
        <i class="iconfont icon-duiqi_you"></i>
      </a>
    </ToolTip>
    <ToolTip class="tool-item" content="粗体">
      <a @mousedown.stop @click="()=> this.$Editor.toggleFontStyle('bold')">
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
            @change="fontColor => changeStyle('fontColor',fontColor)"
            @mousedown="(e) => console.log(e)"
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
            @change="bacgroundColor => changeStyle('fillColor',bacgroundColor)"
            @mousedown="(e) => e.stopstopPropagation()"
          ></el-color-picker>
        </div>
      </a>
    </ToolTip>
  </div>
</template>

<script>
import ToolTip from '../components/ToolTip';
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
      currentShapeStyle: {
        fontSize: 16,
        fontFamily: 'Microsoft YaHei',
        fontColor: '#fff',
        bacgroundColor: '#fff'
      }
    };
  },
  components: {
    ToolTip
  },
  methods: {
    changeStyle() {}
  }
};
</script>

<style lang="scss" scoped>
.table-toolsbar {
  align-items: center;
  margin: 5px 0;
  border-bottom: none;
  padding: 0;
}
</style>