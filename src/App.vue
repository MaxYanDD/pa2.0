<template>
  <div id="app" v-if="hasData">
    <div class="header">
      <ProjectTopBar :user="user" :project="project" />
      <ToolsBar />
    </div>
    <div class="content">
      <!-- 左侧 -->
      <div class="content-left" @click="stopEditing">
        <!-- <pageMenu /> -->
        <ThumbList :activeIndex="activeIndex" :xmls="data.xmls" />
      </div>
      <div class="content-right">
        <PageList :activeXmlId="activeXmlId" :activeIndex="activeIndex" :xmls="data.xmls" />
      </div>
    </div>
  </div>
</template>

<script>
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
      hasData: false,
      project: {
        id: '',
        title: '',
        cover: '',
        name: '',
        number: '',
        proprietor: '',
        linkman: '',
        phone: '',
        email: '',
        page_num: '',
        remark: '',
        template: 'custom'
      },
      data: {
        xmls: [],
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
    this.openLoading();

    this.getUserInfo();

    let id = getUrlParams()['id'] || '729e8d660876';

    if (id) {
      this.getPageData(id);
    } else {
      this.project.id = -1;
      this.hasData = true;
      this.data.xmls.push({
        id: 0,
        title: '新建页面',
        xml: `
        <mxGraphModel dx="38" dy="36" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="778"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="欢迎使用云知光商城方案助手" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000;fontSize=66;" vertex="1" parent="1"><mxGeometry x="57.5" y="127" width="985" height="171" as="geometry"/></mxCell><mxCell id="4" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/logo/eltmall.svg;" vertex="1" parent="1"><mxGeometry x="205" y="499" width="690" height="139" as="geometry"/></mxCell></root></mxGraphModel>`
      });

      this.$nextTick(() => {

        this.loading.close();
      });

    }

    this.$bus.$on('changeActive', this.changeActive);
    this.$bus.$on('save', this.saveAll);
    this.$bus.$on('addXml', this.addXml);
    this.$bus.$on('changePageTitle', this.changePageTitle);
    this.$bus.$on('deleteActiveXml', this.deleteActiveXml);
  },
  mounted() {},
  methods: {
    // 清除编辑状态
    stopEditing() {
      this.$Editor.activeGraph.stopEditing();
      this.$Editor.activeGraph.getSelectionModel().clear(); // 清除cell选中状态
      this.$bus.$emit('updateToolBarStates', 'changeActive'); // 更新toolbars状态
    },

    // 切换page
    changeActive(index) {
      this.stopEditing();
      this.activeIndex = index * 1;
      this.activeXmlId = this.$Editor.switchGraph(index);
    },

    // 改变当前页面标题
    changePageTitle(val) {
      this.data.xmls[this.activeIndex].title = val;
    },

    // 保存所有页面
    async saveAll() {
      this.stopEditing();
      this.data.xmls.forEach((xml, index) => {
        this.savePage(index);
      });

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
      let graph = this.$Editor.findGraphByIndex(index);

      var view = graph.getView();
      var canvas = view.getCanvas();

      console.log(canvas);
      xml.xml = this.$Editor.getGraphXml(graph);
      console.log(xml.xml);
      this.data.pages[index] = this.$Editor.createSvgStr(graph);
    },

    // 根据id请求page数据
    async getPageData(id) {
      try {
        const ret = await httpGet(`/api/edit/getData?id=${id}`);
        if (ret.state == 1) {
          const { project, data } = ret.content;
          this.project = project;
          this.data = data;
          this.activeXmlId = this.data.xmls[0].id * 1;
          this.setDocTitle(this.project.name);
          this.hasData = true;
          this.$nextTick(() => {
            this.$bus.$emit('reload');
            this.closeLoading();
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

    setDocTitle(title) {
      if (title) {
        document.title = title + '-云知光商城方案助手';
      }
    },

    // 插入新增页xml
    addXml() {
      let id = this.getMaxXmlId() + 1;
      let title = '新建页面';
      let xml = '';
      this.data.xmls.splice(this.activeIndex * 1 + 1, 0, { id, title, xml });
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
      //TODO需要提供回退功能
      const xmls = this.data.xmls;
      const len = xmls.length;

      if (len == 1) {
        return;
      }

      // 删除对应的数据和graph实例
      xmls.splice(this.activeIndex, 1);
      this.$Editor.deleteGraph(this.activeIndex);

      // 边界
      if (xmls.length == 1) {
        this.activeIndex = 0;
      } else if (this.activeIndex == len - 1) {
        this.activeIndex = xmls.length - 1;
      }

      this.$nextTick(() => {
        this.changeActive(this.activeIndex);
      });
    },

    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: '#fff'
      });
    },
    closeLoading() {
      this.loading.close();
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
