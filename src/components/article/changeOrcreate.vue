<template class="changeOrcreateBanner">
  <div>
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="分组">
        <el-select v-model="form.group" placeholder="请选择">
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" prop="pic">
        <el-upload
          ref="upload"
          class="my-uploader"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="uploaderImg"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
        >
          <img v-if="form.pic" :src="form.pic" class="uploaderImg" />
          <i v-else class="el-icon-plus my-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="上架">
        <el-switch v-model="form.online" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submitForm"
        v-loading.fullscreen.lock="fullscreenLoading"
      >确 定</el-button>
    </div>
  </div>
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
        title: "",
        group: 0,
        pic: "",
        url: "",
        online: true
      },
      formRules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        pic: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      groupOptions: [
        {
          label: "首页",
          value: 0
        },
        {
          label: "发现",
          value: 1
        },
        {
          label: "我的",
          value: 2
        }
      ]
    };
  },
  created() {
    // console.log(this.type);
  },
  methods: {
    async submitChange() {
      let online = this.form.online ? 0 : 1;
      let res = await this.$api
        .updateCarouselImg(
          this.id,
          this.form.title,
          this.form.group,
          this.form.pic,
          this.form.url,
          online
        )
        .catch(err => {
          return err;
        });
      return res;
    },
    async submitCreate() {
      let online = this.form.online ? 0 : 1;
      let res = await this.$api
        .createCarouselImg(
          this.form.title,
          this.form.group,
          this.form.pic,
          this.form.url,
          online
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
        title: this.info.title,
        group: this.info.group_id,
        pic: this.info.pic,
        url: this.info.url,
        online: this.info.online == 0 ? true : false
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