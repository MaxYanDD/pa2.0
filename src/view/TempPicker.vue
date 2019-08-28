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
            id: '1101',
            title: '封面',
            xml:
            '<mxGraphModel dx="161" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img01.jpg;" vertex="1" parent="1"><mxGeometry width="1076" height="760" as="geometry"/></mxCell><mxCell id="3" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=/static/eltmalllogo.png;" vertex="1" parent="1"><mxGeometry x="90" y="54" width="100" height="100" as="geometry"/></mxCell><mxCell id="4" value="&lt;font color=&quot;#ffdc74&quot;&gt;COMMERCIAL&lt;br&gt;PROJECT&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=80;fontFamily=Impact;" vertex="1" parent="1"><mxGeometry x="90" y="182" width="490" height="213" as="geometry"/></mxCell><mxCell id="5" value="&lt;font color=&quot;#ffdc74&quot;&gt;XXXXXXXX项目&lt;br&gt;&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=40;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="90" y="408" width="488" height="71" as="geometry"/></mxCell><mxCell id="6" value="&lt;font color=&quot;#ffdc74&quot;&gt;灯光概念方案&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="90" y="515" width="488" height="71" as="geometry"/></mxCell><mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=3;strokeColor=rgba(255, 209, 44, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="90" y="502.5" as="sourcePoint"/><mxPoint x="240" y="502.5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="8" value="&lt;font color=&quot;#ffdc74&quot;&gt;2019.02.25&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="90" y="586" width="488" height="46" as="geometry"/></mxCell></root></mxGraphModel>'
          },
          {
            id: '1102',
            title: '封面',
            xml:
              '<mxGraphModel dx="150" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img00.jpg;movable=0;resizable=0;rotatable=0;deletable=0;editable=0;connectable=0;" vertex="1" parent="1"><mxGeometry width="1076" height="760" as="geometry"/></mxCell><mxCell id="3" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/base/eltmalllogo.png;" vertex="1" parent="1"><mxGeometry x="80" y="82" width="108" height="108" as="geometry"/></mxCell><mxCell id="4" value="&lt;font style=&quot;font-size: 96px&quot; color=&quot;#ffffff&quot;&gt;COMMERCIAL&lt;br&gt;PROJECT&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=80;fontFamily=Impact;" vertex="1" parent="1"><mxGeometry x="79" y="217" width="490" height="213" as="geometry"/></mxCell><mxCell id="5" value="&lt;font color=&quot;#ffffff&quot;&gt;XXXXXXXX项目&lt;/font&gt;&lt;br&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=40;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="425" width="488" height="71" as="geometry"/></mxCell><mxCell id="6" value="&lt;font color=&quot;#ffffff&quot;&gt;灯光概念方案&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="526" width="488" height="71" as="geometry"/></mxCell><mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=3;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="80" y="534.5" as="sourcePoint"/><mxPoint x="230" y="534.5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="8" value="&lt;font color=&quot;#ffffff&quot;&gt;2019.02.25&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="80" y="580.5" width="488" height="46" as="geometry"/></mxCell></root></mxGraphModel>'
          },
          {
            id: '1103',
            title: '封面',
            xml:
            '<mxGraphModel dx="-2" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="text;html=1;strokeColor=none;fillColor=rgba(197, 203, 96, 1);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=rgba(219, 228, 116, 1);movable=1;resizable=1;rotatable=1;deletable=1;editable=1;connectable=1;" vertex="1" parent="1"><mxGeometry width="659" height="761" as="geometry"/></mxCell><mxCell id="3" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/office/img04.jpg;imageBorder=rgba(255, 255, 255, 1);strokeWidth=12;movable=1;resizable=1;rotatable=1;deletable=1;editable=1;connectable=1;" vertex="1" parent="1"><mxGeometry x="519" y="57" width="479" height="664" as="geometry"/></mxCell><mxCell id="4" value="&lt;span&gt;UPDATING PROJECT LIGHTING DESIGN&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;rotation=90;fontSize=12;" vertex="1" parent="1"><mxGeometry x="884" y="575" width="242" height="34" as="geometry"/></mxCell><mxCell id="5" value="" style="endArrow=none;html=1;strokeWidth=1;" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="1004.5" y="362" as="sourcePoint"/><mxPoint x="1004.5" y="465" as="targetPoint"/></mxGeometry></mxCell><mxCell id="6" value="" style="text;html=1;strokeColor=none;fillColor=rgba(255, 255, 255, 1);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000" vertex="1" parent="1"><mxGeometry x="85" y="50" width="80" height="72" as="geometry"/></mxCell><mxCell id="7" value="" style="text;html=1;strokeColor=none;fillColor=rgba(255, 255, 255, 1);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000" vertex="1" parent="1"><mxGeometry x="85" y="135" width="40" height="40" as="geometry"/></mxCell><mxCell id="8" value="" style="text;html=1;strokeColor=none;fillColor=rgba(255, 255, 255, 1);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000" vertex="1" parent="1"><mxGeometry x="180" y="50" width="40" height="40" as="geometry"/></mxCell><mxCell id="9" value="&lt;div&gt;&lt;font color=&quot;#fcfcfc&quot;&gt;OFFICE PRECT&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontFamily=Arial;fontSize=54;" vertex="1" parent="1"><mxGeometry x="85" y="291" width="421" height="58" as="geometry"/></mxCell><mxCell id="10" value="&lt;div&gt;&lt;font color=&quot;#c5c360&quot;&gt;XXXXXX项目&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=rgba(255, 255, 255, 1);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontFamily=Arial;fontSize=54;" vertex="1" parent="1"><mxGeometry x="85" y="362" width="344" height="71" as="geometry"/></mxCell><mxCell id="11" value="&lt;font color=&quot;#ffffff&quot;&gt;2019.02.25&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="85" y="534" width="488" height="46" as="geometry"/></mxCell><mxCell id="12" value="&lt;font color=&quot;#ffffff&quot;&gt;灯光概念方案&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="85" y="479.5" width="488" height="71" as="geometry"/></mxCell><mxCell id="13" value="" style="endArrow=none;html=1;strokeColor=rgba(255, 255, 255, 1);strokeWidth=2;" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="85" y="479" as="sourcePoint"/><mxPoint x="188" y="479" as="targetPoint"/></mxGeometry></mxCell></root></mxGraphModel>'
          },
          {
            id: '1103',
            title: '封面',
            xml:
            '<mxGraphModel dx="-2" dy="66" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/office/img01.jpg;movable=1;resizable=1;rotatable=1;deletable=1;editable=1;connectable=1;" vertex="1" parent="1"><mxGeometry x="8" y="8" width="1058" height="744" as="geometry"/></mxCell><mxCell id="3" value="" style="endArrow=none;html=1;strokeWidth=8;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="5" y="247" as="sourcePoint"/><mxPoint x="1067" y="248" as="targetPoint"/></mxGeometry></mxCell><mxCell id="4" value="" style="endArrow=none;html=1;strokeWidth=8;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="1.5" y="518" as="sourcePoint"/><mxPoint x="1070" y="518" as="targetPoint"/></mxGeometry></mxCell><mxCell id="5" value="" style="endArrow=none;html=1;strokeWidth=8;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="266" y="759" as="sourcePoint"/><mxPoint x="267" y="5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="6" value="" style="endArrow=none;html=1;strokeWidth=8;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="549.5" y="246" as="sourcePoint"/><mxPoint x="549.5" y="8" as="targetPoint"/></mxGeometry></mxCell><mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=8;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="819" y="753" as="sourcePoint"/><mxPoint x="821" y="5.5" as="targetPoint"/></mxGeometry></mxCell><mxCell id="8" value="" style="endArrow=none;html=1;strokeWidth=8;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="549" y="756" as="sourcePoint"/><mxPoint x="551" y="519" as="targetPoint"/></mxGeometry></mxCell><mxCell id="9" value="" style="text;html=1;strokeColor=none;fillColor=rgba(232, 225, 79, 0.58);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;movable=0;resizable=0;rotatable=0;deletable=0;editable=0;connectable=0;" vertex="1" parent="1"><mxGeometry x="271" y="250" width="546" height="264" as="geometry"/></mxCell><mxCell id="10" value="&lt;div&gt;&lt;font color=&quot;#fcfcfc&quot;&gt;OFFICE PRECT&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontFamily=Arial;fontSize=48;" vertex="1" parent="1"><mxGeometry x="340" y="274" width="421" height="58" as="geometry"/></mxCell><mxCell id="11" value="&lt;div&gt;&lt;font color=&quot;#ffffff&quot;&gt;XXXXXX项目&lt;/font&gt;&lt;/div&gt;" style="text;html=1;strokeColor=none;fillColor=rgba(255, 255, 255, 0);align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontFamily=Arial;fontSize=48;" vertex="1" parent="1"><mxGeometry x="378" y="318" width="344" height="71" as="geometry"/></mxCell><mxCell id="12" value="&lt;span&gt;&lt;font color=&quot;#ffffff&quot;&gt;UPDATING PROJECT LIGHTING DESIGN&lt;/font&gt;&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;rotation=0;fontSize=14;" vertex="1" parent="1"><mxGeometry x="383.5" y="382" width="333" height="34" as="geometry"/></mxCell><mxCell id="13" value="" style="endArrow=none;html=1;strokeColor=rgba(255, 255, 255, 1);" edge="1" parent="1"><mxGeometry width="150" relative="1" as="geometry"><mxPoint x="382.5" y="415.5" as="sourcePoint"/><mxPoint x="718.5" y="416" as="targetPoint"/></mxGeometry></mxCell><mxCell id="14" value="&lt;font color=&quot;#ffffff&quot;&gt;灯光概念方案&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=28;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="451.5" y="420" width="197" height="46" as="geometry"/></mxCell><mxCell id="15" value="&lt;font color=&quot;#ffffff&quot;&gt;2019.02.25&lt;/font&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=24;fontFamily=Microsoft YaHei;" vertex="1" parent="1"><mxGeometry x="442.5" y="466" width="215" height="33" as="geometry"/></mxCell></root></mxGraphModel>'
          }
        ],
        catalogs: [
          {
            id: '1201',
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