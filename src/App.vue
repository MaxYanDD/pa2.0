<template>
  <div id="app">
    <div class="header">
      <ProjectTopBar />
      <ToolsBar />
    </div>
    <div class="content">
      <div class="content-left">
        <ThumbList :activeId="activeId" :pages="pages" />
      </div>
      <div class="content-right">
        <PageList :activeId="activeId" :pages="pages" />
      </div>
    </div>
  </div>
</template>

<script>
// import main from './mxgraph'
import ProjectTopBar from "./view/ProjectTopBar";
import ThumbList from "./view/ThumbList";
import ToolsBar from "./view/ToolsBar";
import PageList from "./view/PageList";

export default {
  name: "App",
  data() {
    return {
      pages: [
        {
          id: 0,
          name: "封面",
          xml:
            '<mxGraphModel dx="1426" dy="838" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFD966;" vertex="1" parent="1"><mxGeometry width="541" height="826" as="geometry"/></mxCell><mxCell id="3" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#EA6B66;" vertex="1" parent="1"><mxGeometry x="541" width="624" height="823" as="geometry"/></mxCell></root></mxGraphModel>'
        },
        {
          id: 1,
          name: "目录",
          xml:
            '<mxGraphModel dx="1426" dy="838" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFD966;" vertex="1" parent="1"><mxGeometry width="541" height="826" as="geometry"/></mxCell><mxCell id="3" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#EA6B66;" vertex="1" parent="1"><mxGeometry x="541" width="624" height="823" as="geometry"/></mxCell></root></mxGraphModel>'
        }
      ],
      activeId: 0
    };
  },
  components: {
    ProjectTopBar,
    ThumbList,
    ToolsBar,
    PageList
  },
  created() {
    this.$bus.$on("changeActive", id => {
      this.activeId = id;
      this.$Editor.switchGraph(this.activeId);
    });
  },
  mounted() {}
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  height: 100%;
}

ul,
li {
  list-style: none;
}

#app {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.header {
  position: absolute;
  top: 0;
  bottom: 86px;
  left: 0;
  right: 0;
}

.content {
  position: absolute;
  top: 86px;
  left: 0;
  bottom: 0;
  right: 0;
}

.content-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 240px;
  border-right: 1px solid #dae1e7;
  overflow: auto;
}

.content-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 240px;
  overflow: auto;
  background-color: #f5f5f5;
}

.mxRubberband {
    position: absolute;
    overflow: hidden;
    border-style: solid;
    border-width: 1px;
    border-color: #0000FF;
    background: #0077FF;
}
</style>
