<template>
  <div class="wrap">
    <div class="add-btn" @click="addPage">
     添加页面
    </div>
  </div>
</template>

<script>
  export default {
    methods:{
      addPage(){
        this.$bus.$emit('addXml')
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  height: 54px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .add-btn{
    width: 140px;
    height: 30px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #cbcbcb;
    cursor: pointer;
    &:hover{
      background-color: #cbcbcb;
    }
  }
}
</style>