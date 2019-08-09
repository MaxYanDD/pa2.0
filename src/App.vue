<template>
  <div id="app">
    <div class="header">
      <ProjectTopBar :user="user" :project="project" />
      <ToolsBar />
    </div>
    <div class="content">
      <div class="content-left" @click="stopEditing">
        <pageMenu />
        <ThumbList :activeIndex="activeIndex" :xmls="data.xmls" />
      </div>
      <div class="content-right">
        <PageList :activeXmlId="activeXmlId" :activeIndex="activeIndex" :xmls="data.xmls" />
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
import pageMenu from './components/pageMenu';
import { getUrlParams } from '@/utils/utils';
import { httpGet, httpPost } from '@/utils/request';

export default {
  name: 'App',
  data() {
    return {
      project: {
        id: '',
        title: '测试方案',
        cover: 'images/2019/0708/68df3b5eab764b25ef62571ac6d329f6e239e2de.jpeg',
        name: '测试方案',
        number: 'test',
        proprietor: 'test',
        linkman: '',
        phone: '',
        email: 'test@qq.com',
        page_num: '',
        remark: ''
      },
      data: {
        xmls: [
          {
            id: 0,
            title: '空白',
            // xml:'<mxGraphModel dx="1102" dy="838" grid="0" gridSize="10" guides="1" tooltips="1" connect="0" arrows="0" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" background="#ffffff"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="16" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/asst/business/img00.jpg;" vertex="1" parent="1"><mxGeometry x="173" y="112" width="709" height="501" as="geometry"/></mxCell><mxCell id="18" value="Text" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=22;fontColor=#FFFFFF;" vertex="1" parent="1"><mxGeometry x="234" y="139" width="210" height="105" as="geometry"/></mxCell></root></mxGraphModel>',
            xml: `
            <mxGraphModel dx="75" dy="29" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="742.5"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="6" value="双击可输入文本" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=66;" vertex="1" parent="1"><mxGeometry x="57.5" y="50" width="985" height="621" as="geometry"/></mxCell></root></mxGraphModel>`
          }
        ],
        pages: [],
        time: ''
      },
      activeIndex: 0,
      activeXmlId: 0,
      user: {
        name: '',
        avatar: '',
        company: ''
      }
    };
  },
  components: {
    ProjectTopBar,
    ThumbList,
    ToolsBar,
    PageList,
    pageMenu
  },
  created() {
    this.getUserInfo();

    let id = getUrlParams()['id'] || '729e8d660876';

    if (id) {
      this.getData(id);
    } else {
      this.project.id = -1;
    }

    this.$bus.$on('changeActive', this.changeActive);
    this.$bus.$on('save', this.saveAll);
    this.$bus.$on('addXml', this.addXml);
    this.$bus.$on('changePageTitle', this.changePageTitle);
    this.$bus.$on('deleteActiveXml', this.deleteActiveXml);
  },
  mounted() {
    window.addEventListener('DOMMouseScroll', this.handleScroll, true); //TODO 无效
  },
  methods: {
    // 清除编辑状态
    stopEditing() {
      this.$Editor.activeGraph.stopEditing();
      this.$Editor.activeGraph.getSelectionModel().clear(); // 清除cell选中状态
      this.$bus.$emit('updateToolBarStates', 'changeActive'); // 更新toolbars状态
    },

    // 切换page
    changeActive(index) {
      console.log(index);
      this.stopEditing();
      this.activeIndex = index * 1;
      this.activeXmlId = this.$Editor.switchGraph(index);
    },

    changePageTitle(val) {
      this.data.xmls[this.activeIndex].title = val;
    },

    // 保存所有页面
    async saveAll() {
      this.stopEditing();
      this.data.xmls.forEach((xml, index) => {
        this.savePage(index);
      });
      this.data.pages = this.$Editor.createSvgStr();

      let params = {
        project: this.project,
        data: this.data
      };

      try {
        const ret = await httpPost('/api/edit/saveData', params);
        if (ret.state == 1) {
          this.project.id = ret.content.id;
          this.$message({ message: '保存成功', type: 'success' });
        }
      } catch (err) {
        console.log(err);
      }
    },

    // 保存指定页
    savePage(index) {
      let xml = this.data.xmls[index];
      let graphs = this.$Editor.graphs;
      let graph = null;
      for (let i = 0; i < graphs.length; i++) {
        if (graphs[i].id == xml.id) {
          graph = graphs[i];
          break;
        }
      }
      xml.xml = this.$Editor.getGraphXml(graph);
    },

    // 处理滚轮事件
    handleScroll(e) {
      console.log(e);
    },

    // 根据id请求page数据
    async getData(id) {
      try {
        const ret = await httpGet(`/api/edit/getData?id=${id}`);
        if (ret.state == 1) {
          const { project, data } = ret.content;
          this.project = project;
          this.data = data;
          this.activeXmlId = this.data.xmls[0].id * 1;

          this.$nextTick(() => {
            this.$bus.$emit('reload');
          });
        }
        //TODO如果有localstorage，对比data中的time,如果localstorage中的时间更晚，弹窗提示，是否替换现有的。
      } catch (err) {}
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const ret = await httpGet('/api/user/info');
        if (ret.state == 1) {
          this.user = ret.content;
        } else {
          window.location.href = '/login?forward=' + encodeURIComponent(window.location.href);
        }
      } catch (err) {}
    },

    // 插入新增页xml
    addXml() {
      let id = this.getMaxXmlId() + 1;
      let title = '新建页面';
      let xml = '';
      this.data.xmls.splice(this.activeIndex + 1, 0, { id, title, xml });
      this.$nextTick(() => {
        this.$bus.$emit('addPage', id, xml, this.activeIndex + 1);
      });
    },
    // 获取最大的xmlId
    getMaxXmlId() {
      let max = 0;
      this.data.xmls.forEach(xml => {
        if (xml.id * 1 > max) {
          max = xml.id * 1;
        }
      });
      return max;
    },

    // 删除当前页面
    deleteActiveXml() {
      this.data.xmls.splice(this.activeIndex, 1);
      if(this.data.xmls.length == 1){
        this.activeIndex = 0;
      }
      this.activeXmlId = this.activeIndex;
      this.data.xmls.forEach((xml, index) => {
        //修改对应xml的id
        xml.id = index;
      });
       this.$nextTick(() => {
           this.$bus.$emit('reload');
      });
    }
  }
};
</script>

<style lang='scss'>
@import './assets/sass/global.scss';

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
  background-color: #fff;
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
  overflow: hidden;
  background-color: #fcfcfc;
}

.content-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 240px;
  overflow: auto;
  background-color: rgb(242, 242, 242);
}
</style>
