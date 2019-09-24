<template>
  <div class="model_product" @dblclick.stop @click="clickHandler">
    <img
      class="thumb"
      src="http://yx.litku.yzess.cn/source/image/94219fc65ec55694778310f0f6a3ab986889ccf2.jpg"
      alt
    />
    <div class="params">
      <p>明装射灯</p>
      <p>角度{{p_adjustable_angle}}</p>
      <p>功率：{{p_totalpower}}</p>
      <p>光通量：≥524lm</p>
      <p>色温：2900K</p>
      <p>光束角：24°</p>
      <p>显色指数：Ra≥80</p>
    </div>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      p_adjustable_angle: '可调节',
      p_totalpower: '16W',
      dialogVisible: false
    };
  },
  methods: {
    clickHandler() {
      console.log('click');
    }
  }
};
</script>

<style lang="scss">
.model_product {
  width: 100%;
  height: 100%;
  display: flex;
  .thumb {
    flex: 1;
    height: 100%;
  }
  .params {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    font-size: 14px;
  }
}
</style>