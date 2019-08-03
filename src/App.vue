<template>
  <div id="app">
    <div class="header">
      <ProjectTopBar />
      <ToolsBar />
    </div>
    <div class="content">
      <div class="content-left" @click="stopEditing">
        <ThumbList :activeIndex="activeIndex" :pages="fileData.pages" />
      </div>
      <div class="content-right">
        <PageList :activeIndex="activeIndex" :pages="fileData.pages" />
      </div>
    </div>
  </div>
</template>

<script>
// import main from './mxgraph'
import ProjectTopBar from './view/ProjectTopBar';
import ThumbList from './view/ThumbList';
import ToolsBar from './view/ToolsBar';
import PageList from './view/PageList';

export default {
  name: 'App',
  data() {
    return {
      fileData: {
        projectInfo: {
          name:'demo'
        },
        companyInfo: {},
        pages: [
          {
            id: 0,
            name: '封面',
            // xml:'<mxGraphModel dx="1102" dy="838" grid="0" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="16" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img00.jpg;" vertex="1" parent="1"><mxGeometry x="173" y="112" width="709" height="501" as="geometry"/></mxCell><mxCell id="18" value="Text" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=22;fontColor=#FFFFFF;" vertex="1" parent="1"><mxGeometry x="234" y="139" width="210" height="105" as="geometry"/></mxCell></root></mxGraphModel>',
            xml: `
            <mxGraphModel dx="17" dy="61" grid="0" gridSize="10" guides="1" tooltips="1" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="960" pageHeight="720">
              <root>
                <mxCell id="0"/>
                <mxCell id="1" parent="0"/>
                <mxCell id="2" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img00.jpg;" vertex="1" parent="1">
                  <mxGeometry width="960" height="719" as="geometry"/>
                </mxCell>
                <mxCell id="3" value="&lt;span&gt;COMMERCIAL&lt;/span&gt;&lt;br&gt;&lt;span&gt;PROJECT&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=60;fontColor=#FFFFFF;fontFamily=Impact;" vertex="1" parent="1">
                  <mxGeometry x="104" y="175" width="323" height="170" as="geometry"/>
                </mxCell>
              </root>
            </mxGraphModel>`
          },
          {
            id: 1,
            name: '目录',
            xml: ''
          }
        ]
      },
      activeIndex: 0
    };
  },
  components: {
    ProjectTopBar,
    ThumbList,
    ToolsBar,
    PageList
  },
  created() {
    this.$bus.$on('changeActive', index => {
      this.activeIndex = index;
    });
    this.$bus.$on('save',this.saveAll)
  },
  mounted() {},
  methods: {
    stopEditing() {
      this.$Editor.activeGraph.stopEditing();
      this.$Editor.activeGraph.getSelectionModel().clear(); // 清除cell选中状态
      this.$bus.$emit('updateToolBarStates', 'changeActive'); // 更新toolbars状态
    },
    saveAll(){
      this.stopEditing();
      this.fileData.pages.forEach((page,index)=>{
        this.savePage(index)
      })
    },
    savePage(index){
      const page = this.fileData.pages[index];
      const graphs = this.$Editor.graphs;
      let graph = null;
      for(let i = 0; i< graphs.length ; i++){
        if(graphs[i].id == page.id){
          graph = graphs[i];
          break;
        }
      }
      page.xml = this.$Editor.getGraphXml(graph)
    }
  }
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
  border-color: #0000ff;
  background: #0077ff;
}
</style>
