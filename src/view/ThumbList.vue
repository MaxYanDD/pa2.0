<template>
  <div class="thumb-list" v-contextmenu:contextmenu @contextmenu="handleContextMenu">
    <el-scrollbar>
      <div
        class="thumb-item"
        v-for="(xml,index) in xmls"
        :key="xml.id"
        :class="{active: (index == activeIndex)}"
      >
        <span class="index">{{index*1 + 1}}</span>
        <div class="thumb-box" @click="changeActive(index)" @contextmenu.prevent="changeActive(index)">
          <figure></figure>
          <div class="thumb-name">
            <input :value="xml.title" @input="changePageTitle($event)" />
          </div>
        </div>
      </div>
    </el-scrollbar>


    <v-contextmenu ref="contextmenu" class="menu-override-thumb">
      <v-contextmenu-item @click="(e) => this.$bus.$emit('deleteActiveXml')">
        删除
      </v-contextmenu-item>
    </v-contextmenu>

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
    changeActive(index) {
      this.$bus.$emit('changeActive', index);
    },
    changePageTitle(e){
      this.$bus.$emit('changePageTitle', e.target.value)
    },
    handleContextMenu(e){
      if(!e.target.classList.contains('thumb-box')){
        console.log('hide');
        this.$refs.contextmenu.hide();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.thumb-list {
  height: 100%;
  padding-top: 54px;
  overflow-y: hidden;
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
      input {
        display: block;
        width: 100%;
        background-color: transparent;
        text-align: center;
        line-height: 22px;
        font-size: 12px;
        color: #606f7b;
        outline: none;
        border: none;
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