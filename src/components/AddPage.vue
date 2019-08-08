<template>
  <div class="add">
    <div class="add-btn">
     添加页面
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.add{
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