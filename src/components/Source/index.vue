<!--
 * @Author: lijing
 * @Date: 2019-07-08 12:25:28
 * @LastEditTime: 2019-07-29 10:36:35
 * @LastEditors: lijing
 * @Description:资源管理器组件
 -->
<template>
  <el-dialog
    class="c_resource_poplayer"
    title="请选择资源"
    :visible="layerVisible"
    @close="handleVisible"
    width="900px"
  >
    <div class="c_resource_poplayer_header">
      <div class="c_left">
        <el-upload
          class="c_btn_upload"
          :show-file-list="false"
          :action="uploadActionURL"
          :on-error="uploadError"
          :on-progress="uploadProgress"
          :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-button size="small" @click="handleMkdir">新建分组</el-button>
        <el-button size="small" @click="handleRenew">刷新</el-button>
        <el-button size="small" @click="handleImgDelete" v-if="activeImgLen">删除</el-button>
      </div>
      <div class="c_right">
        <!-- <div class="c_r_showType">
          <el-button type="primary" icon="el-icon-s-unfold" size="small"></el-button>
          <el-button type="primary" icon="el-icon-menu" size="small"></el-button>
        </div>-->
        <div class="c_r_search">
          <el-input placeholder="请输入内容" size="small">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="c_resource_poplayer_content">
      <!-- 内容部分 -->
      <div class="c_resource_poplayer_menu">
        <el-tree
          :data="treeData"
          :props="treeProps"
          node-key="id"
          ref="menu_tree"
          :highlight-current="true"
          :expand-on-click-node="false"
          :check-on-click-node="true"
          @node-click="treeNodeChange"
        >
          <!-- 定制tree图标 -->
          <span class="custom-tree-node" slot-scope="{ node }">
            <span class="el-icon-folder">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div
        class="c_resource_poplayer_wrap"
        v-loading="isLoading"
        v-infinite-scroll="loadMoreSource"
        infinite-scroll-delay="100"
        infinite-scroll-distance="100"
        infinite-scroll-immediate="false"
        :infinite-scroll-disabled="isLastPage"
      >
        <ul class="c_resource_poplayer_items" ref="popLayerImages">
          <li v-for="item in uploadList" :key="item.id">
            <el-progress
              v-if="!(item.percentage ==100)"
              type="circle"
              :percentage="Math.floor(item.percentage)"
              :stroke-width="5"
              :width="116"
            ></el-progress>

            <!--    -->
            <img :src="item.url" />
          </li>
          <li v-for="item in resourceList" :key="item.id">
            <el-image
              :src="item.url"
              @click="handleActiveImg({id:item.id,url:item.url})"
              :class="{'activeImg el-icon-check':(activeImgIdArrs.includes(item.id) )}"
            >
              <!-- {'url':item.url,'id':item.id} -->
              <div slot="error" class="image_error">
                <i class="el-icon-picture-outline"></i>
                <span>加载失败</span>
              </div>
            </el-image>
          </li>
        </ul>
        <p v-if="isLastPage" class="isLastPage">没有更多了</p>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleVisible" size="medium">取 消</el-button>
      <el-button type="primary" @click="updateChooseImg" size="medium">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { sourceMenu, sourceList, sourceMkdir, imgDelete } from './api'
// import { throttle } from '@/utils/utils'
export default {
  name: 'cResource',
  props: {
    // 显示、隐藏
    layerVisible: {
      type: Boolean,
      default: false
    },
    //资源选择方式：1批量，0单选
    activeType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      uploadActionURL: 'https://jsonplaceholder.typicode.com/posts/',
      // 树菜单渲染数据
      treeData: [],
      currentDirID: 'all', //当前文件目录id
      // 树型菜单挂载字符段
      treeProps: {
        children: 'sub_menu',
        label: 'label'
      },
      // 图片列表
      resourceList: [],
      //最后一页
      isLastPage: 0,
      currentPage: 0,
      //选中的图片
      activeImg: [],
      //选中ID列表 设置选中状态
      activeImgIdArrs: [],
      uploadList: [],
      isLoading: true,
      treeNodeId: ''
      // loadCount: 0
    }
  },
  created() {
    // this.loadCount++
    // console.log(this.loadCount)
    // console.log('created加载...')
  },
  mounted() {
    // console.log('mounted加载...')
    const _self = this
    _self.getSourceMenu()
    // 获取默认列表
    _self.getSourceList()
  },
  computed: {
    activeImgLen() {
      return this.activeImg.length == 0 ? false : true
    }
  },
  methods: {
    async getSourceMenu() {
      const { code, data } = await sourceMenu()
      if (!code && data) {
        this.treeData = data.menuList
      } else {
        this.$message.error('资源管理的菜单列表获取失败，code:' + code)
      }
    },
    /**
     * @description:获取文件夹的列表
     * @param {dir} {String} 文件id
     * @param {page} {Number} 页码
     * @return:
     */
    async getSourceList({
      dir = 'all',
      page = 1,
      isload = false,
      isRenew = false
    } = {}) {
      const { code, content, end, total } = await sourceList({
        dir: dir,
        page: page
      })
      const _self = this
      if (!code && content) {
        if (isload && !isLoadash) {
          // 当前页面加载
          _self.resourceList.push.apply(_self.resourceList, content.rows)
        } else {
          // 切换文件夹
          // _self.resourceList.length = 0
          _self.resourceList = content.rows
        }

        _self.isLastPage = end === total ? true : false
        _self.isLoading = false
      } else {
        _self.$message.error('图片列表获取失败，code:' + code)
      }
    },
    // 刷新
    handleRenew() {
      const _self = this
      _self.isLoading = true
      _self.resetActiveImg()
      // debounce(
      _self.getSourceList({
        dir: _self.currentDirID,
        page: 1,
        isRenew: true
      })
      // ),200)
    },
    // 新建文件夹
    handleMkdir() {
      const _self = this
      const dirId = _self.currentDirID
      _self
        .$prompt('请输入文件的名称', '新建文件夹', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          // inputPattern: /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im,
          // inputErrorMessage:'文件名称不能包含**&&特殊符号'
        })
        .then(async ({ value }) => {
          const { code, content } = await sourceMkdir(dirId, value)
          if (!code) {
            _self.$refs.menu_tree.append(
              { id: content.id, label: value },
              _self.currentDirID == 'all' ? '' : _self.currentDirID
            )

            _self.$message({
              type: 'success',
              message: '文件夹创建成功'
            })
          } else {
            _self.$message.error('文件夹创建失败,code:' + code)
          }
        })
        .catch(() => { })
    },
    // 删除图片
    handleImgDelete() {
      const _self = this
      const idArrs = _self.activeImgIdArrs
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { code } = await imgDelete(idArrs)
          if (!code) {
            // 重新加载资源
            _self.resetActiveImg()
            _self.getSourceList({
              dir: _self.currentDirID,
              page: _self.currentPage
            })
          } else {
            _self.$message.error('删除失败！')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => { })
    },
    loadMoreSource() {
      // 滚动加载
      const _self = this
      let loadPage = _self.currentPage++
      if (!_self.isLastPage) {
        _self.getSourceList({
          dir: _self.currentDirID,
          page: loadPage,
          isload: true
        })
      }
    },
    handleVisible() {
      // 显示弹窗口时，清除历史数据
      this.$emit('handleVisible', false)
      this.resetActiveImg()
    },
    resetActiveImg() {
      this.activeImgIdArrs = []
      this.activeImg = []
    },

    treeNodeChange(data, node, item) {
      const _self = this
      const { id } = data
      console.log('data:', data)
      console.log('id:' + id)
      if (id !== _self.currentDirID) {
        _self.isLoading = true
        _self.currentDirID = id
        _self.currentPage = 1
        _self.treeNodeId = data.$treeNodeId
        _self.getSourceList({ dir: id })
      }
    },
    handleActiveImg(imgOjb) {
      // console.log('点击的图片信息：', imgOjb)

      const _self = this

      if (_self.isActivedImg(imgOjb)) {
        // 移除该元素
        _self.removeActiveImg(imgOjb)
        _self.activeImgIdArrs.splice(
          _self.activeImgIdArrs.indexOf(imgOjb.id),
          1
        )
      } else {
        if (!_self.activeType) {
          _self.resetActiveImg()
        }
        _self.activeImg.push(imgOjb)
        _self.activeImgIdArrs.push(imgOjb.id)
      }
    },
    isActivedImg(img) {
      const _self = this
      return _self.activeImg.some((item, index) => {
        return item.id == img.id
      })
    },
    removeActiveImg(img) {
      const _self = this
      _self.activeImg.forEach((item, index) => {
        if (item.id == img.id) {
          console.log('被删除的图片为：', item.id)
          _self.activeImg.splice(index, 1)
        }
      })
    },
    updateChooseImg() {
      const _self = this
      _self.$emit('updateChooseImg', _self.activeImg)
      _self.handleVisible()
    },
    uploadError(err, file) {
      // 上传失败
      this.$message.error(file.name + '上传失败！')
    },
    uploadProgress(event, file, fileList) {
      // 上传中
      this.uploadList = fileList
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.warning('文件大小不能超过 5MB!')
        return
      }
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/scss/_variables.scss";
@import "@/assets/scss/_mixins.scss";

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.c_resource_poplayer {
  .c_resource_poplayer_header {
    height: 48px;
    @include clearfix;
    .c_left {
      float: left;
    }
    .c_right {
      float: right;
      height: 48px;
      // display: flex;
      vertical-align: middle;
      & > div {
        height: 100%;
        display: inline-block;
      }
      .c_r_search {
        margin-left: 12px;
      }
      .c_r_search > div {
        vertical-align: inherit;
      }
    }
  }
  .c_resource_poplayer_content {
    width: 100%;
    overflow: hidden;
    position: relative;
    height: 500px;
  }
  .c_resource_poplayer_menu {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 200px;
  }
  .c_resource_poplayer_wrap {
    margin-left: 200px;
    height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
    ul {
      margin-left: -15px;
      @include clearfix;
    }
    li {
      display: block;
      float: left;
      width: 116px;
      height: 116px;
      margin: 0 0 15px 15px;
      background: #fff;
      &:hover {
        opacity: 0.9;
      }
      .el-image {
        &.activeImg {
          border: 1px solid $brand;
          &::before {
            position: absolute;
            right: 5px;
            bottom: 5px;
            color: #fff;
            font-size: 16px;
          }
        }
      }
      // 图片加载失败
      .image_error {
        text-align: center;
        padding-top: 40px;
        padding-left: 24px;
        i {
          font-size: 14px;
        }

        span {
          font-size: 12px;
        }
      }
    }
  }

  .c_btn_upload {
    float: left;
    margin-right: 15px;
  }
  .isLastPage {
    text-align: center;
    font-size: 12px;
    color: $textSub;
    margin: 0;
  }
}
</style>

