<template>
  <div class="temp-picker">
    <div class="left">
      <el-menu default-active="cover" class="el-menu-vertical-override" @select="changeMenu">
        <el-menu-item index="cover">
          <span slot="title">封面</span>
        </el-menu-item>
        <el-menu-item index="catalogs">
          <span slot="title">目录</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <el-scrollbar>
        <div class="tempList" v-if="xmlList.length > 0">
          <div
            v-for="(xml,index) in xmlList"
            :key="index"
            @click="(e)=>append(e,index)"
            class="temp-item"
          >
            <div class="svg-item" :ref="index"></div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  data() {
    return {
      drag: false,
      data: {
        cover: [
          {
            id: '1000',
            title: '封面',
            xml:
              '<mxGraphModel dx="150" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img00.jpg;" vertex="1" parent="1"><mxGeometry width="1077" height="762" as="geometry"/></mxCell><mxCell id="3" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=/static/eltmalllogo.png;" vertex="1" parent="1"><mxGeometry x="90" y="54" width="100" height="100" as="geometry"/></mxCell><mxCell id="4" value="&lt;font color=&quot;#ffdc74&quot;&gt;COMMERCIAL&lt;br&gt;PROJECT&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=80;fontFamily=Impact;" vertex="1" parent="1"><mxGeometry x="135" y="182" width="490" height="213" as="geometry"/></mxCell><mxCell id="5" value="&lt;font color=&quot;#ffdc74&quot;&gt;XXXXXXXX项目&lt;br&gt;&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=40;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="90" y="408" width="488" height="71" as="geometry"/></mxCell><mxCell id="6" value="&lt;font color=&quot;#ffdc74&quot;&gt;灯光概念方案&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="526" width="488" height="71" as="geometry"/></mxCell><mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=3;strokeColor=rgba(255, 209, 44, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="80" y="534.5" as="sourcePoint"/><mxPoint x="230" y="534.5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="8" value="&lt;font color=&quot;#ffdc74&quot;&gt;2019.02.25&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="580.5" width="488" height="46" as="geometry"/></mxCell></root></mxGraphModel>'
          },
          {
            id: '1003',
            title: '封面',
            xml:
              '<mxGraphModel dx="150" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img00.jpg;movable=0;resizable=0;rotatable=0;deletable=0;editable=0;connectable=0;" vertex="1" parent="1"><mxGeometry width="1076" height="760" as="geometry"/></mxCell><mxCell id="3" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/base/eltmalllogo.png;" vertex="1" parent="1"><mxGeometry x="80" y="82" width="108" height="108" as="geometry"/></mxCell><mxCell id="4" value="&lt;font style=&quot;font-size: 96px&quot; color=&quot;#ffffff&quot;&gt;COMMERCIAL&lt;br&gt;PROJECT&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=80;fontFamily=Impact;" vertex="1" parent="1"><mxGeometry x="79" y="217" width="490" height="213" as="geometry"/></mxCell><mxCell id="5" value="&lt;font color=&quot;#ffffff&quot;&gt;XXXXXXXX项目&lt;/font&gt;&lt;br&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=40;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="425" width="488" height="71" as="geometry"/></mxCell><mxCell id="6" value="&lt;font color=&quot;#ffffff&quot;&gt;灯光概念方案&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="526" width="488" height="71" as="geometry"/></mxCell><mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=3;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="80" y="534.5" as="sourcePoint"/><mxPoint x="230" y="534.5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="8" value="&lt;font color=&quot;#ffffff&quot;&gt;2019.02.25&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="580.5" width="488" height="46" as="geometry"/></mxCell></root></mxGraphModel>'
          }
        ],
        catalogs: [
          {
            id: '1001',
            title: '目录',
            xml:
              '<mxGraphModel dx="150" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img02.jpg;" vertex="1" parent="1"><mxGeometry y="191" width="500" height="396" as="geometry"/></mxCell><mxCell id="3" value="" style="endArrow=none;html=1;" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="560" y="19" as="sourcePoint"/><mxPoint x="560" y="731" as="targetPoint"/></mxGeometry></mxCell><mxCell id="4" value="&lt;span&gt;01. XXXXXXXXXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;" vertex="1" parent="1"><mxGeometry x="601" y="131" width="421" height="60" as="geometry"/></mxCell><mxCell id="5" value="&lt;span&gt;XXXXXX / XXXXXX / XXXXXXX / XXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=20;" vertex="1" parent="1"><mxGeometry x="590.5" y="181.5" width="442" height="23" as="geometry"/></mxCell><mxCell id="6" value="&lt;span&gt;02. XXXXXXXXXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;" vertex="1" parent="1"><mxGeometry x="601" y="264" width="421" height="60" as="geometry"/></mxCell><mxCell id="7" value="&lt;span&gt;XXXXXX / XXXXXX / XXXXXXX / XXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=20;" vertex="1" parent="1"><mxGeometry x="590.5" y="314.5" width="442" height="23" as="geometry"/></mxCell><mxCell id="8" value="&lt;span&gt;03. XXXXXXXXXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;" vertex="1" parent="1"><mxGeometry x="601" y="408" width="421" height="60" as="geometry"/></mxCell><mxCell id="9" value="&lt;span&gt;XXXXXX / XXXXXX / XXXXXXX / XXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=20;" vertex="1" parent="1"><mxGeometry x="590.5" y="458.5" width="442" height="23" as="geometry"/></mxCell><mxCell id="10" value="&lt;span&gt;04. XXXXXXXXXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;" vertex="1" parent="1"><mxGeometry x="601" y="550.5" width="421" height="60" as="geometry"/></mxCell><mxCell id="11" value="&lt;span&gt;XXXXXX / XXXXXX / XXXXXXX / XXXXXXX&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=20;" vertex="1" parent="1"><mxGeometry x="590.5" y="601" width="442" height="23" as="geometry"/></mxCell><mxCell id="12" value="&lt;font color=&quot;#ffffff&quot;&gt;目录&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;" vertex="1" parent="1"><mxGeometry x="364" y="460.5" width="74" height="42" as="geometry"/></mxCell><mxCell id="13" value="" style="endArrow=none;html=1;strokeColor=rgba(255, 255, 255, 1);strokeWidth=2;" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="321" y="512" as="sourcePoint"/><mxPoint x="428" y="511.5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="14" value="&lt;font color=&quot;#ffffff&quot;&gt;contents&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=right;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=40;" vertex="1" parent="1"><mxGeometry x="275" y="522.5" width="150" height="36" as="geometry"/></mxCell></root></mxGraphModel>'
          }
        ]
      },
      xmlList: []
    };
  },
  created() {
    this.xmlList = this.data['cover'];
  },
  mounted() {
    this.drawThumb();
  },
  components: {
    draggable
  },
  methods: {
    changeMenu(index) {
      this.xmlList = this.data[index];
      this.$nextTick(() => {
        this.drawThumb();
      });
    },
    append(e, index) {
      //由于drag冲突,模拟双击
      let { xml, title } = this.xmlList[index];
      this.$bus.$emit('addXml', title, xml);
    },
    // 刷新缩略图
    createThumb(index) {
      let xml = this.xmlList[index];
      const graph = this.$Editor.createGraph(xml, this.$refs[index][0]);
      this.$Editor.loadGraphXml(xml.xml, graph);
      const pageWidth = graph.pageFormat.width;
      const pageHeight = graph.pageFormat.height;

      const { width: thumbWidth, height: thumbHeight } = this.$refs[index][0].getBoundingClientRect();

      let scaleX = thumbWidth / pageWidth;
      this.$refs[index][0].innerHTML = '';
      this.$Editor.addGraphFragment(this.$refs[index][0], graph, scaleX);
    },
    // 生成缩略图
    drawThumb() {
      let len = this.xmlList.length;
      for (let i = 0; i < len; i++) {
        this.createThumb(i);
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 500,
        group: 'description',
        disabled: false
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.temp-picker {
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
  .left {
    width: 100px;
    border-right: solid 1px #e6e6e6;
  }
  .right {
    flex: 1;
    .tempList {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      height: 100%;
      overflow-y: hidden;
      .svg-item {
        width: 300px;
        height: 212px;
        user-select: none;

      }
      .temp-item {
        margin: 20px 0 20px 20px;
        box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.12);
        transition: box-shadow 0.5s;

        position: relative;
        &:hover {
          box-shadow: 0 4px 8px 3px rgba(0, 0, 0, 0.3);
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
    }
  }
}
</style>