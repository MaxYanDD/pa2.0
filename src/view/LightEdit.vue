<template>
  <div>
    <div class="form-horizontal lui-form form-md">
      <div class="form-group">
        <label class="control-label col-xs-2">产品来源：</label>
        <div class="col-xs-9 flex">
          <p class="form-control-static">
            <span
              v-text="['','我的灯具库','严选灯具库'][lightEditDialog.light.store||0]"
              :class="{mr15:lightEditDialog.light.store>0}"
            ></span>
            <a href="javascript:;" class="link" @click="showLightStore(1)">从严选灯具库选择</a>
            <em class="split-line-h ml5 mr5 hide"></em>
            <a href="javascript:;" class="link hide" @click="showLightStore()">从我的灯具库选择</a>
          </p>
        </div>
      </div>
      <div class="form-group required">
        <label class="control-label col-xs-2 pl0">产品名称：</label>
        <div class="col-xs-9">
          <input
            class="form-control font12"
            v-model="lightEditDialog.light.name"
            maxlength="60"
            ref="lightEditDialogName"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-xs-2">代号/数量：</label>
        <div class="col-xs-9 flex">
          <input
            class="form-control font12 flex-1 mr15"
            v-model="lightEditDialog.light.no"
            maxlength="20"
            placeholder="代号，如：L1"
          />
          <input
            class="form-control font12 flex-1"
            v-model="lightEditDialog.light.quantity"
            maxlength="5"
            placeholder="数量"
            @change="blur('lightEditDialog.light.quantity',null,'int',99999,1)"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-xs-2">单价/质保：</label>
        <div class="col-xs-9 flex">
          <div class="flex-1 mr15">
            <input
              class="form-control font12"
              v-model="lightEditDialog.light.price"
              maxlength="9"
              @change="blur('lightEditDialog.light.price',null,'float',2,999999,0)"
              placeholder="单价"
            />
          </div>
          <div class="flex-1">
            <select class="form-control font12" v-model="lightEditDialog.light.warranty">
              <option value>质保年限</option>
              <option value="-">无质保</option>
              <option value="1年">1年</option>
              <option value="2年">2年</option>
              <option value="3年">3年</option>
              <option value="4年">4年</option>
              <option value="5年">5年</option>
              <option value="6年">6年</option>
              <option value="7年">7年</option>
              <option value="8年">8年</option>
              <option value="9年">9年</option>
              <option value="10年">10年</option>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-xs-2">品牌/型号：</label>
        <div class="col-xs-9 flex">
          <input
            class="form-control font12 flex-1 mr15"
            v-model="lightEditDialog.light.brand"
            maxlength="30"
            placeholder="品牌"
          />
          <input
            class="form-control font12 flex-1"
            v-model="lightEditDialog.light.code"
            maxlength="30"
            placeholder="型号"
          />
        </div>
      </div>
      <div class="form-group mb0">
        <label class="control-label col-xs-2">产品图片：</label>
        <div class="col-xs-9 flex flex-wrap">
          <div class="mr15 mb15">
            <div
              class="img img-bordered img-square img-rounded w80"
              v-if="lightEditDialog.light.cover"
            >
              <figure>
                <img :src="image(lightEditDialog.light.cover,320)" />
              </figure>
              <span class="img-change-btn" @click="setImage('lightEditDialog.light.cover')">更换</span>
            </div>
            <a
              class="img img-square img-upload img-upload-hover w80"
              v-else
              @click="setImage('lightEditDialog.light.cover')"
            >
              <figure>
                <div class="img-upload-bd center-in-parent">
                  <i class="ico-plus ico-plus-24 ico-plus-org"></i>
                </div>
              </figure>
            </a>
            <p class="font12 mt5 text-grey text-center">外形图</p>
          </div>
          <div class="mr15 mb15" v-for="(it,k) in lightEditDialog.light.pics">
            <div class="img img-bordered img-square img-rounded w80" v-if="it.src">
              <figure>
                <img :src="image(it.src,320)" />
              </figure>
              <span class="img-change-btn" @click="setImage('src',it)">更换</span>
            </div>
            <a
              class="img img-square img-upload img-upload-hover w80"
              v-else
              @click="setImage('src',it)"
            >
              <figure>
                <div class="img-upload-bd center-in-parent">
                  <i class="ico-plus ico-plus-24 ico-plus-org"></i>
                </div>
              </figure>
            </a>
            <p class="font12 mt5 text-grey text-center" v-text="it.name"></p>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-xs-2">产品描述：</label>
        <div class="col-xs-9">
          <textarea
            class="form-control font12"
            rows="3"
            v-model="lightEditDialog.light.feature"
            maxlength="100"
          ></textarea>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-xs-2">备 注：</label>
        <div class="col-xs-9">
          <textarea
            class="form-control font12"
            rows="3"
            v-model="lightEditDialog.light.remark"
            maxlength="100"
          ></textarea>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer flex-center">
      <button class="btn btn-default mr10 w80" @click="lightEditDialog.visible=false">取消</button>
      <button class="btn btn-success w80" @click="setLightSlot">确定</button>
    </div>
  </div>
</template>

<script>
export default {
  props:['visible'],
  data() {
    return {
      eltStoreDialog:{
        visible:false
      }
    }
  },
  methods: {
    showLightStore() {
      this.eltStoreDialog.visible = true;
      if (!this.getLightStoreFirst) {
        this.getLightStoreFirst = true;
        this.getLightStore();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>