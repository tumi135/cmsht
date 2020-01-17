<template class="changeOrcreateBanner">
  <el-dialog
    :title="type == 'change' ? '编辑趣图' : '创建趣图'"
    :visible.sync="dialogFormVisible"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="100px" ref="form" :rules="formRules">
      <el-form-item label="标题(只读)" prop="image_title" >
        <el-input v-model="form.image_title" maxlength="10" show-word-limit readonly></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="image_link">
        <el-upload
          ref="upload"
          class="my-uploader"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="uploaderImg"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
        >
          <img v-if="form.image_link" :src="form.image_link" class="uploaderImg" />
          <i v-else class="el-icon-plus my-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述" prop="image_desc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          v-model="form.image_desc"
          maxlength="30"
          show-word-limit
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        v-loading.fullscreen.lock="fullscreenLoading"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { changeOrcreateMixins } from "../../mixins/changeOrcreate";
export default {
  props: {
    type: String,
    dialogFormVisible: Boolean,
    info: Object
  },
  mixins: [changeOrcreateMixins],
  data() {
    return {
      fullscreenLoading: false,
      id: "",
      form: {
        image_title: "官方",
        image_link: "",
        image_desc: null
      },
      formRules: {
        image_title: [
          { required: true, message: "请填写标题", trigger: "blur" }
        ],
        image_link: [
          { required: true, message: "请上传图片", trigger: "blur" }
        ],
        image_desc: [{ required: true, message: "请填写描述", trigger: "blur" }]
      }
    };
  },
  created() {
    // console.log(this.type);
  },
  methods: {
    async submitChange() {
      let res = await this.$api
        .funnyImgChange(
          this.id,
          this.form.image_title,
          this.form.image_link,
          this.form.image_desc
        )
        .catch(err => {
          return err;
        });
      return res;
    },
    async submitCreate() {
      let res = await this.$api
        .createFunnyImg(
          this.form.image_title,
          this.form.image_link,
          this.form.image_desc
        )
        .catch(err => {
          return err;
        });
      return res;
    }
  },
  watch: {
    info() {
      this.id = this.info.id;
      this.form = {
        // image_title: this.info.image_title,
        image_link: this.info.image_link,
        image_desc: this.image_desc
      };
    }
  }
};
</script>

<style scoped>
@import "../../assets/css/base.css";
.changeOrcreateBanner {
  width: 100%;
  height: 100%;
}
.el-input {
  width: 300px;
}
</style>