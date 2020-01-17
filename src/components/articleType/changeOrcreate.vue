<template class="changeOrcreate">
  <el-dialog
    :title="type == 'change' ? '编辑文章分类' : '创建文章分类'"
    :visible.sync="dialogFormVisible"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="分类名" prop="type_name">
        <el-input
          v-model="form.type_name"
          maxlength="5"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="listorder">
        <el-input
          v-model="form.listorder"
          maxlength="2"
          show-word-limit
          placeholder="50以内正整数，数字越小越靠后"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="litpic">
        <el-upload
          ref="upload"
          class="my-uploader"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="uploaderImg"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
        >
          <img v-if="form.litpic" :src="form.litpic" class="uploaderImg" />
          <i v-else class="el-icon-plus my-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        v-loading.fullscreen.lock="fullscreenLoading"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { changeOrcreateMixins } from "../../mixins/changeOrcreate";
export default {
  props: {
    type: String,
    dialogFormVisible: Boolean,
    info: Object,
    myTotal: Number
  },
  mixins: [changeOrcreateMixins],
  data() {
    var myReg = /^[1-9][0-9]*$/;
    var listorderValidator = (rule, value, callback) => {
      if (!myReg.test(value) || value > 50) {
        return callback(new Error("请填写50以内正整数!!"));
      }
      callback();
    };
    return {
      fullscreenLoading: false,
      id: "",
      total: 0,
      form: {
        litpic: "",
        listorder: "",
        type_name: ""
      },
      formRules: {
        litpic: [{ required: true, message: "请上传图标", trigger: "blur" }],
        listorder: [
          { required: true, message: "请填写排序", trigger: "blur" },
          { required: true, validator: listorderValidator, trigger: "blur" }
        ],
        type_name: [
          { required: true, message: "请填写分类名", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // console.log(this.type);
  },
  methods: {
    async submitChange() {
      let res = await this.$api
        .articleTypeChange(
          this.id,
          this.form.type_name,
          this.form.listorder,
          this.form.litpic
        )
        .catch(err => {
          return err;
        });
      return res;
    },
    async submitCreate() {
      var tips;
      if (this.myTotal >= 18 && this.myTotal < 30) {
        await this.$confirm("文章分类已超9种, 是否继续增加?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            tips = this.createType();
          })
          .catch(() => {
            tips = "取消操作";
          });
        return tips;
      } else if (this.myTotal >= 30) {
        await this.$alert(
          "文章分类已有30种, 请删除不需要的分类后再添加",
          "提示",
          {
            confirmButtonText: "确定"
          }
        ).then(() => {
          tips = "取消操作";
        });
        return tips;
      } else {
        return this.createType();
      }
    },
    async createType() {
      let res = await this.$api
        .createArticleType(
          this.form.type_name,
          this.form.listorder,
          this.form.litpic
        )
        .catch(err => {
          return err;
        });
      console.log(res);
      return res;
    }
  },
  watch: {
    info() {
      this.id = this.info.id;
      this.form = {
        litpic: this.info.litpic,
        listorder: this.info.listorder,
        type_name: this.info.type_name
      };
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/base.css";
.changeOrcreate {
  width: 100%;
  height: 100%;
}
.el-input {
  width: 300px;
}
</style>
