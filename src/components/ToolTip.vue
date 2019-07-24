<template>
  <el-tooltip @mousedown="console.log('触发');event.preventDefault();" class="tool-item" effect="dark" :content="content" placement="bottom"  transition="none" :enterable="false" :hide-after="700">
    <slot></slot>
  </el-tooltip>
</template>

<script>
export default {
  props:['content'],
  data() {
    return {
    }
  }
};
</script>
