<template>
  <div class="topbar">
    <div class="tb-left">
      <a class="back fa fa-angle-left" href="/" title="返回"></a>
      <div class="project-info" title="至少4个字符">
        <input
          type="text"
          placeholder="未命名方案"
          :value="project.title"
          @input="changeProjectTitle($event)"
        />
        <i class="fa fa-edit"></i>
      </div>
      <div class="project-set">
        <el-dropdown @command="handleCommand" placement="bottom-start" size="mini" trigger="click">
          <span class="el-dropdown-link">
            设置
            <i class="fa fa-angle-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setProInfo">方案信息</el-dropdown-item>
            <el-dropdown-item command="setComInfo">公司信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="istoolsbar">
      <div class="block">
        <div class="istool-item" @click="()=>{this.$bus.$emit('save')}">
          <i class="iconfont icon-baocun"></i>
          <span class="tip">保存</span>
        </div>
        <div class="istool-item" @click="(e) => this.$Editor.undo()">
          <i class="iconfont icon-undo"></i>
          <span class="tip">撤销</span>
        </div>
        <div class="istool-item" @click="() => this.$Editor.redo()">
          <i class="iconfont icon-redo"></i>
          <span class="tip">重做</span>
        </div>
        <div class="istool-item" @click="(e) => this.$Editor.deletCells(e)">
          <i class="iconfont icon-icon-test"></i>
          <span class="tip">删除</span>
        </div>
      </div>
      <div class="block">
        <div class="istool-item" @click="() => this.$Editor.insertText()">
          <i class="iconfont icon-twenbenkuang"></i>
          <span class="tip">文本</span>
        </div>
        <div class="istool-item" @click="() => this.$bus.$emit('insertImage')">
          <i class="iconfont icon-tupian"></i>
          <span class="tip">图片</span>
        </div>
        <div class="istool-item" @click="() => this.$Editor.insertLine()">
          <i class="iconfont icon-Line-Tool"></i>
          <span class="tip">线条</span>
        </div>
        <div class="istool-item">
          <i class="iconfont icon-shapes"></i>
          <span class="tip">形状</span>
        </div>
        <div class="istool-item" @click="() => this.dialogTableVisible = !this.dialogTableVisible">
          <i class="iconfont icon-table"></i>
          <span class="tip">表格</span>

          <el-dialog
            title="编辑表格"
            top="5vh"
            :visible.sync="dialogTableVisible"
            width="90%"
            :append-to-body="true"
            class="el-dialog-override el-dialog-override-table"
          >
            <TableEditor @close="() => this.dialogTableVisible = !this.dialogTableVisible" />
          </el-dialog>
        </div>
      </div>

      <div class="block">
        <div class="istool-item" @click="insertProductModel">
          <img class="img-ico" src="http://imgcache.eltmall.com/images/2019/0418/4666b9e003941dcd1f0ebc09d459e2b727a23de9.svg" alt="云知光商城" />
          <span class="tip">灯具</span>
        </div>
        <el-dialog
          title="云知光商城灯具库"
          top="15vh"
          :visible.sync="lightEditVisible"
          :append-to-body="true"
          class="el-dialog-override el-dialog-override-table"
        >
          <LightEdit @close="() => this.lightEditVisible = !this.lightEditVisible" />
        </el-dialog>
      </div>
    </div>
    <div class="tb-right">
      <div class="dlBtn">
        <el-progress
          v-if="progress>0 && progress < 100"
          type="circle"
          :percentage="parseInt(progress)"
          :width="30"
          :stroke-width="2"
        ></el-progress>
        <a
          v-else-if="progress == 0 || progress == 100"
          @click="()=>this.$bus.$emit('download')"
          class="download"
          target="_blank"
        >下载</a>
      </div>

      <!-- <a @click="()=>this.$bus.$emit('download')" class="download" target="_blank">下载</a> -->
      <div class="user">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <img :src="user.avatar" alt="头像" class="avatar-small" />
          </span>
          <el-dropdown-menu class="user-drop-down" slot="dropdown">
            <div class="user-info">
              <p class="user-company">{{user.company}}</p>
              <div class="user-avatar">
                <img :src="user.avatar" alt="头像" />
              </div>
              <p class="user-name">{{user.name}}</p>
            </div>
            <div class="user-menu">
              <a class="menu-item" href="/">
                <i class="fa fa-file"></i>
                <span>我的方案</span>
              </a>
              <a class="menu-item" href="/account">
                <i class="fa fa-user"></i>
                <span>我的账号</span>
              </a>
              <a class="menu-item" href="javascript:;">
                <i class="fa fa-key"></i>
                <span>修改密码</span>
              </a>
            </div>
            <div class="logout">
              <a href="/logout">退出</a>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';
import domtoimage from 'dom-to-image';
import TableEditor from './TableEditor';
import LightEdit from './LightEdit'
import Product from './models/Product';
export default {
  props: ['user', 'project', 'progress'],
  data() {
    return { visible: false, dialogTableVisible: false,lightEditVisible:false };
  },
  methods: {
    handleCommand() {
      // TODO弹窗填写公司信息和方案信息
      console.log();
    },
    download() {
      // TODO下载
    },
    changeProjectTitle(e) {
      this.$bus.$emit('changeProjectTitle', e.target.value);
    },
    insertProductModel() {
      let mxcell = this.$Editor.insertModel('<div class="model1"><div>', 240, 115);
      this.$nextTick(() => {
        let model =  Vue.extend({
          template:'<Product />',
          components:{
            Product
          }
        })
        let modelVm = new model().$mount('.page-list .model1');
        // mxcell[0].setValue(modelVm.$el.outerHTML);
      });
    }
  },
  components: {
    TableEditor,
    LightEdit
  },
  created() {
    console.log(this, Product);
  }
};
</script>
<style lang="scss" scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid #e2e6ed;

  .tb-left {
    display: flex;
    align-items: center;

    .back {
      width: 44px;
      height: 44px;
      line-height: 42px;
      text-align: center;
      font-size: 20px;

      &:hover {
        color: #3388ff;
      }
    }

    .project-info {
      position: relative;
      height: 30px;
      cursor: pointer;

      input {
        width: 150px;
        padding: 0 25px 0 4px;
        max-width: 300px;
        border: 1px solid #fff;
        outline: none;
        font-size: 16px;
        display: inline-block;
        line-height: 30px;
        margin-right: 5px;
      }

      i {
        font-size: 14px;
        position: absolute;
        top: 10px;
        right: 8px;
        cursor: default;
      }

      &:hover {
        input {
          border: 1px solid #ccc;
        }
      }
    }

    .project-set {
      span {
        font-size: 12px;
        margin-left: 10px;
        color: #3388ff;
        cursor: pointer;
      }
    }
  }

  .tb-right {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    .dlBtn {
      width: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      .download {
        display: block;
        flex: 1;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #3388ff;

        &:hover {
          background-color: #eff8ff;
        }
      }
    }

    .user {
      .el-dropdown-link {
        display: block;
        height: 44px;
        line-height: 44px;
        font-size: 0;
        padding: 0 20px;
        cursor: pointer;

        &:hover {
          background-color: #eff8ff;
        }

        img {
          vertical-align: middle;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
      }
    }
  }

  .istoolsbar {
    display: flex;
    justify-content: space-around;
    flex: 1;
    .block {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .istool-item {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          background-color: rgba(0, 0, 0, 0.04);
        }
        .iconfont {
          font-size: 20px;
          margin-bottom: 4px;
          color: #606f7b;
          transition: color 0.2s;
        }
        .tip {
          color: #5b6b73;
        }
        .img-ico {
          width: 20px;
          height: 20px;
          margin-bottom: 6px;
        }
      }
    }
  }
}

.user-info {
  width: 270px;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;

  .user-company {
    text-align: center;
    font-weight: 700;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .user-avatar {
    margin: 0 auto;
    width: 60px;
    height: 60px;
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .user-name {
    text-align: center;
    color: #777;
  }
}

.user-drop-down {
  .user-menu {
    padding: 20px 0;
    display: flex;
    justify-content: center;

    .menu-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      color: #333;

      i {
        color: #888;
        font-size: 20px;
        margin-bottom: 10px;
      }

      &:hover {
        background-color: #eff8ff;

        i {
          color: #3388ff;
        }

        span {
          color: #3388ff;
        }
      }
    }
  }

  .logout {
    display: flex;
    margin-bottom: -10px;
    justify-content: center;
    align-items: center;
    height: 50px;
    border-top: 1px solid #eaeaea;
    background-color: #f5f5f6;

    a {
      &:hover {
        color: #3388ff;
      }
    }
  }
}
</style>