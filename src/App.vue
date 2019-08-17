<template>
  <div id="app" v-if="hasData">
    <div class="header">
      <ProjectTopBar :user="user" :project="project" />
    </div>
    <div class="content">
      <!-- 左侧 -->
      <div class="content-left" @click="stopEditing">
        <!-- <pageMenu /> -->
        <ThumbList :activeIndex="activeIndex" :xmls.sync="data.xmls" />
      </div>
      <div class="content-right">
        <div class="toolsbar-wrap">
          <ToolsBar />
        </div>
        <PageList :activeGraphId="activeGraphId" :activeIndex="activeIndex" :xmls="data.xmls" />
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
import { getUrlParams, formatDateTime } from '@/utils/utils';
import { httpGet, httpPost } from '@/utils/request';
import print from '@/utils/print';

export default {
  name: 'App',
  data() {
    return {
      hasData: false,
      hasModify: false,
      isDwonloading: false,
      isUploading: false,
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
      activeGraphId: 0,
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
    this.openLoading('正在加载...');

    this.getUserInfo();

    let id = getUrlParams()['id'];

    if (IS_DEV) {
      id = '73edd4f10c7f';
    }

    if (id) {
      this.getPageData(id);
    } else {
      this.project.id = -1;
      this.hasData = true;
      this.data.xmls.push({
        id: 0,
        title: '首页',
        xml: `
        <mxGraphModel dx="33" dy="45" grid="0" gridSize="10" guides="1" tooltips="0" connect="0" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1076" pageHeight="760"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="3" value="" style="shape=image;imageAspect=0;aspect=aspect;verticalLabelPosition=bottom;verticalAlign=top;image=http://imgcache.eltmall.com/logo/eltmall.svg;" vertex="1" parent="1"><mxGeometry x="193" y="380" width="690" height="139" as="geometry"/></mxCell><mxCell id="4" value="&lt;span&gt;&lt;font style=&quot;font-size: 66px&quot;&gt;欢迎使用云知光商城方案助手&lt;/font&gt;&lt;/span&gt;" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#000" vertex="1" parent="1"><mxGeometry x="75" y="111" width="926" height="108" as="geometry"/></mxCell></root></mxGraphModel>
        `
      });

      this.$nextTick(() => {
        this.loading.close();
      });
    }

    this.$bus.$on('changeActive', this.changeActive);
    this.$bus.$on('save', this.upload);
    this.$bus.$on('addXml', this.addXml);
    this.$bus.$on('copyXml', this.copyXml);

    this.$bus.$on('changePageTitle', this.changePageTitle);
    this.$bus.$on('changeProjectTitle', this.changeProjectTitle);
    this.$bus.$on('deleteActiveXml', this.deleteActiveXml);
    this.$bus.$on('modelChange', this.modifyStatus);
    // this.$bus.$on('download', this.download);
    this.$bus.$on('download', this.downloadPdfFrontEnd);
    this.keyDownHandler();
  },
  mounted() {},
  methods: {
    // 清除编辑状态
    stopEditing() {
      this.$Editor.activeGraph.stopEditing();
      this.$Editor.activeGraph.getSelectionModel().clear(); // 清除cell选中状态
      this.$bus.$emit('updateToolBarStates', 'changeActive'); // 更新toolbars状态
    },

    modifyStatus() {
      this.hasModify = true;
    },

    // 切换page
    changeActive(index) {
      this.stopEditing();
      this.activeIndex = index * 1;
      this.activeGraphId = this.$Editor.switchGraph(index);
    },

    // 改变当前页面标题
    changePageTitle(val) {
      this.data.xmls[this.activeIndex].title = val;
    },

    changeProjectTitle(val) {
      this.project.title = val;
    },

    async download() {
      if (!/\S{4,}/.test(this.project.title)) {
        this.$message.error('方案名称必须大于4个字符');
        return;
      }

      if (!this.isDwonloading) {
        this.isDwonloading = true;

        this.saveAll();

        let params = {
          project: this.project,
          data: this.data
        };

        this.$message('正在生成，请耐心等待');

        try {
          const ret = await httpPost('/api/edit/saveData', params);
          this.isDwonloading = false;
          if (ret.state == 1) {
            this.hasModify = false;
            this.project.id = ret.content.id;
            window.open(`/view/download/${this.project.id}`);
          }
        } catch (err) {
          this.isDwonloading = false;
        }
      } else {
        this.$message('下载中...');
      }
    },

    async upload() {
      if (!this.hasModify) {
        this.$message('您的所有修改已保存');
        return;
      }

      if (!/\S{4,}/.test(this.project.title)) {
        this.$message.error('方案名称必须大于4个字符');
        return;
      }

      if (!this.isUploading) {
        this.isUploading = true;
        this.saveAll();
        let params = {
          project: this.project,
          data: this.data
        };

        try {
          const ret = await httpPost('/api/edit/saveData', params);
          if (ret.state == 1) {
            this.isUploading = false;
            this.project.id = ret.content.id;
            this.hasModify = false;
            this.$message({ message: '保存成功', type: 'success' });
          }
        } catch (err) {
          console.log(err);
          this.isUploading = false;
        }
      } else {
        this.$message('保存中...');
      }
    },
    // 保存所有页面
    saveAll() {
      this.stopEditing();
      this.data.pages = [];
      this.data.xmls.forEach((xml, index) => {
        this.savePage(index);
      });
    },

    // 保存指定页
    savePage(index) {
      let xml = this.data.xmls[index];
      let graph = this.$Editor.findGraphByIndex(index);

      var view = graph.getView();
      var canvas = view.getCanvas();

      xml.xml = this.$Editor.getGraphXml(graph);
      this.data.pages.push(this.$Editor.createSvgStr(graph));
    },

    // 根据id请求page数据
    async getPageData(id) {
      try {
        const ret = await httpGet(`/api/edit/getData?id=${id}`);
        if (ret.state == 1) {
          const { project, data } = ret.content;
          this.project = project;
          this.data = data;
          this.activeGraphId = this.data.xmls[0].id * 1;
          this.setDocTitle(this.project.title);
          this.hasData = true;
          this.$nextTick(() => {
            this.$bus.$emit('reload');
            this.loading.close();
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
        }
      } catch (err) {}
    },

    setDocTitle(title) {
      if (title) {
        document.title = title + '-云知光商城方案助手';
      }
    },

    // 复制当前xml
    copyXml() {
      this.savePage(this.activeIndex);
      const { title, xml } = this.data.xmls[this.activeIndex];
      this.addXml(title, xml);
    },

    // 插入新增页xml
    addXml(title, xml) {
      let id = this.getMaxXmlId() + 1;
      title = title || '新建页面';
      xml = xml || '';
      this.data.xmls.splice(this.activeIndex * 1 + 1, 0, { id, title, xml });
      this.$nextTick(() => {
        this.hasModify = true;
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
        this.hasModify = true;
        this.changeActive(this.activeIndex);
      });
    },

    openLoading(string) {
      this.loading = this.$loading({
        lock: true,
        text: string,
        spinner: 'el-icon-loading',
        background: '#fff'
      });
    },

    // ctrl+s保存功能
    keyDownHandler(e) {
      document.addEventListener('keydown', e => {
        if (e.keyCode == 83 && e.ctrlKey) {
          e.preventDefault();
          this.upload();
        }
      });
    },

    // 下载
    async downloadPdfFrontEnd() {
      this.openLoading('下载中...');
      this.saveAll();

      // 创建预览
      let divForPrint = document.createElement('div');
      divForPrint.className = 'print-wrap';
      divForPrint.innerHTML = this.data.pages.join('');
      divForPrint.style.cssText = `position:fixed;top:0;left:0;z-index:-1;`;
      document.body.appendChild(divForPrint);

      // 打印
      await print(this.project.title + '-云知光方案助手-' + formatDateTime(new Date()));

      this.loading.close();
      document.body.removeChild(divForPrint);
    }
  },

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
  left: 0;
  right: 0;
  background-color: #fff;
}

.content {
  position: absolute;
  top: 45px;
  left: 0;
  bottom: 0;
  right: 0;
}

.content-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 200px;
  border-right: 1px solid #dae1e7;
  overflow: hidden;
  background-color: #fcfcfc;
}

.content-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 200px;
  overflow: hidden;
  background-color: rgb(242, 242, 242);
  .toolsbar-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 2;
  }
}
</style>
