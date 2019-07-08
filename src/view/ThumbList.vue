<template>
  <div class="thumb-list">
    <div class="thumb-item" v-for="page in pages" :key="page.id">
      <span class="serial">{{page.id + 1}}</span>
      <div class="thumb-box" :class="{active: (page.id == activeId)}" @click="changeActive(page.id)">
        <figure></figure>
        <div class="thumb-name">
          <p>{{page.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pages: {
      type: Array
    },
    activeId: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeActive(id) {
      this.$bus.$emit('changeActive',id)
    }
  }
};
</script>

<style lang="scss" scoped>
.thumb-list {
  .thumb-item {
    display: flex;
    justify-content: flex-end;
    width: 205px;
    margin: 20px 0;
    .serial {
      margin-right: 20px;
      color: #202124;
    }
    .thumb-box {
      box-sizing: content-box;
      width: 149.333px;
      border: 1px solid #DAE1E7;
      figure {
        background-color: #fff;
        height: 84px;
      }
      &:hover {
        margin: -1px;
        border-width: 2px;
        border-color: #8795A1;
      }
      &.active {
        margin: -1px;
        border-width: 2px;
        border-color: #3388FF;
      }
    }
    .thumb-name {
      height: 22px;
      margin: 0 1px 1px;
      background-color: rgba(230, 230, 230, .9);
      p {
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        color: #606F7B
      }
    }
  }
}
</style>