<template>
  <div class="table-editor-wrapper">
    <TableToolsBar />
    <div class="table-content">
      <div id="jexcel" ref="spreadsheet"></div>
      <div class="tool">
        <div class="row">
          <div>
            <span>行:</span>
            <el-input-number
              class="el-input-number-override"
              v-model="tableRow"
              controls-position="right"
              :min="1"
              :max="100"
              size="mini"
            ></el-input-number>
          </div>
          <div>
            <span style="margin-left: 5px">列:</span>
            <el-input-number
              class="el-input-number-override"
              v-model="tableCol"
              controls-position="right"
              :min="1"
              :max="100"
              size="mini"
            ></el-input-number>
          </div>
        </div>
        <el-button type="primary" class="el-btn-create_table" @click="createTable">生 成</el-button>
        <el-button type="primary" class="el-btn-create_table" @click.stop="insertTable">插入表格</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import jexcel from 'jexcel';
import 'jexcel/dist/jexcel.css';
import TableToolsBar from './TableToolsBar';

var options = {
  data: [[]],
  minDimensions: [3, 3],
  columns: [{ width: '150' }, { width: '150' }, { width: '150' }]
};

export default {
  name: 'TableEditor',
  data() {
    return {
      tableRow: 3,
      tableCol: 3
    };
  },
  components: {
    TableToolsBar
  },
  methods: {
    createTable() {},
    insertTable() {
      // 获取tbody的宽高信息，获取每行的宽
      let tbody = this.spreadsheet.tbody;
      let h = tbody.offsetHeight + 1;
      let w = this.spreadsheet.colgroup.reduce((total, item) => total + item.width * 1, 1);

      // 克隆编辑后的表格，删除第一列
      let copyTbody = tbody.cloneNode(true);
      let childs = copyTbody.childNodes;
      for (let i = childs.length - 1; i >= 0; i--) {
        childs[i].removeChild(childs[i].childNodes[0]);
      }

      // 拼接colgroup
      let colgroupStr = `<colgroup>${this.spreadsheet.colgroup.map(item => item.outerHTML).join('')}</colgroup>`;

      // 拼接tabledomstr
      let tableDomStr = `<table  class="jexcel jexcel-override" width="100%" height="100%" style="width:100%;height:100%;" cellpadding="0" cellspacing="0">${colgroupStr}${copyTbody.outerHTML}</table>`;

      this.$Editor.insertTable(tableDomStr, w, h);
      console.log(w, h);
    }
  },
  mounted() {
    this.spreadsheet = jexcel(document.querySelector('#jexcel'), options);
  }
};
</script>
<style lang="scss" scoped>
.table-editor-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  .table-content {
    display: flex;
    .tool {
      width: 200px;
      height: 200px;
      .row {
        display: flex;
        justify-content: space-around;
      }
    }
  }
  #jexcel {
    flex: 1;
    overflow: auto;
    margin-right: 20px;
    background: #f5f5f5;
    min-height: 400px;
  }
}

.el-btn-create_table {
  width: 100%;
  line-height: 1;
  padding: 7px 0;
  margin: 10px 0;
}
.tool-create_table {
  li.divider {
    margin: 5px 0;
    height: 0;
    border-bottom: 1px solid #e8e8e8;
  }
  li {
    p {
      line-height: 34px;
      cursor: pointer;
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}
</style>