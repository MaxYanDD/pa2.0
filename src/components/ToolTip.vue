<template>
  <el-tooltip @mousedown="event.preventDefault();" class="tool-item" effect="dark" :content="content" placement="bottom"  transition="none" :enterable="false" :open-delay="300" :hide-after="1000">
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
