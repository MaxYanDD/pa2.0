<template>
  <el-tooltip :disabled="disabled" v-model="show" class="tool-item" effect="dark" :content="content" placement="bottom"  transition="none" :enterable="false" :open-delay="300" :hide-after="1000">
    <slot @click="clickHandler"></slot>
  </el-tooltip>
</template>

<script>
export default {
  props:['content','disabled'],
  props:{
    content:{
      type: String,
    },
    disabled:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods:{
    clickHandler(){
      console.log('tooltop');
    }
  }
};
</script>
