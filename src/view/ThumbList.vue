<template>
  <div class="thumb-list">
    <el-scrollbar>
      <div
        class="thumb-item"
        v-for="(xml,index) in xmls"
        :key="xml.id"
        :class="{active: (index == activeIndex)}"
      >
        <span class="index">{{xml.id*1 + 1}}</span>
        <div class="thumb-box" @click="changeActive(xml.id,index)">
          <figure></figure>
          <div class="thumb-name">
            <p>{{xml.title}}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    xmls: {
      type: Array
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeActive(id, index) {
      this.$bus.$emit('changeActive', id, index);
    },
    scrollFunc(e) {
      var direct = 0;
      console.log(e);
      var t1 = document.getElementById('wheelDelta');
      var t2 = document.getElementById('detail');
      if (e.wheelDelta) {
        //IE/Opera/Chrome
        t1.value = e.wheelDelta;
      } else if (e.detail) {
        //Firefox
        t2.value = e.detail;
      }
      ScrollText(direct);
    }
  }
};
</script>

<style lang="scss" scoped>
.thumb-list {
  height: 100%;
  padding-top: 54px;
  .thumb-item {
    display: flex;
    justify-content: flex-end;
    width: 205px;
    margin: 20px 0;

    .index {
      margin-right: 6px;
      color: #202124;
    }
    .thumb-box {
      box-sizing: content-box;
      width: 149.333px;
      border: 1px solid #dae1e7;
      figure {
        background-color: #fff;
        height: 84px;
      }
      &:hover {
        margin: -1px;
        border-width: 2px;
        border-color: #8795a1;
      }
    }
    .thumb-name {
      height: 22px;
      margin: 0 1px 1px;
      background-color: rgba(230, 230, 230, 0.9);
      p {
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        color: #606f7b;
      }
    }
    &.active {
      .thumb-box {
        margin: -1px;
        border-width: 2px;
        border-color: #3388ff;
      }
      .index {
        color: #3388ff;
      }
    }
  }
}
</style>