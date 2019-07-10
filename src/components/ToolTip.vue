<template>
  <el-tooltip class="tool-item" effect="dark" :content="content" placement="bottom-start"  transition="none" :enterable="false">
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
