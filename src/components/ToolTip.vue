<template>
  <el-tooltip class="tool-item" :effect="effect" content="文本框" placement="bottom-start">
    <slot></slot>
  </el-tooltip>
</template>

<script>
export default {
  data() {
    return {
      effect: 'dark',
      placement: 'bottom-start'
    }
  }
};
</script>
