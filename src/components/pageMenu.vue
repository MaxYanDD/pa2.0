<template>
  <div class="wrap">
    <div class="new" @click="addPage">新建空白页</div>
    <div class="load" @click="()=>this.$bus.$emit('toggleDrawer')">从模板新建</div>
    <!-- <el-dialog
      title="选择模板页"
      top="5vh"
      :visible.sync="dialogTableVisible"
      width="80%"
      :append-to-body="true"
      class="el-dialog-override el-dialog-override-temp"
    >
     
      <TempPicker />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
   

  </div>
</template>

<script>

export default {
  data() {
    return {
      dialogTableVisible: false,
    };
  },
  components:{
    
  },
  methods: {
    addPage() {
      this.$bus.$emit('addXml');
    },
    addPageFromTemp() {}
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  .new {
    width: 80px;
    padding: 8px;
    line-height: 1;
    border-radius: 15px 0 0 15px;
    border: 1px solid #cbcbcb;
    cursor: pointer;
    &:hover {
      background-color: #cbcbcb;
    }
  }
  .load {
    width: 80px;
    line-height: 1;
    border: 1px solid #cbcbcb;
    border-radius: 0 15px 15px 0;
    padding: 8px;
    margin-left: -1px;
    cursor: pointer;
    &:hover {
      background-color: #cbcbcb;
    }
  }

}
</style>