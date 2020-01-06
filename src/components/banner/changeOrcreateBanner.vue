<template class="changeOrcreateBanner">
  <el-dialog
    :title="type == 'change' ? '编辑轮播图' : '创建轮播图'"
    :visible.sync="dialogFormVisible"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="标题">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.group" placeholder="请选择">
          <el-option
            v-for="item in groupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片">
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
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        v-loading.fullscreen.lock="fullscreenLoading"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    type: String,
    dialogFormVisible: Boolean,
    info: Object
  },
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
      formRules: {},
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
    //上传本地图片
    async uploaderImg(file) {
      const isLt1M = file.size / 1024 / 1024 / 2 < 1;
      let reader = new FileReader(); //html5读文件
      let that = this;
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 500k!");
        return false;
      }
      reader.readAsDataURL(file.raw); //转BASE64
      reader.onload = async function() {
        //读取完毕后调用接口
        let banner = await that.$api
          .uploadImgByBase64(reader.result, "banner")
          .catch(err => {
            return err;
          });
        if (banner.ret == 200 && banner.data.err_code == 0) {
          that.form.pic = banner.data.url;
        } else {
          that.$message({
            message: "图片上传失败,刷新或换图片！",
            type: "error"
          });
        }
      };
    },
    async submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.fullscreenLoading = true;
          var res;
          console.log(this.type)
          if (this.type == "change") {
            console.log("=====")
            res = await this.submitChange();
          } else if (this.type == "create") {
            console.log("++++++")
            res = await this.submitCreate();
          } else {
            this.$message({
              message: "操作失败！",
              type: "error"
            });
            return false
          }
          console.log(res)
          if (res.ret == 200 && res.data.err_code == 0) {
            this.$message({
              message: "操作成功!",
              type: "success"
            });
            this.$router.go(0);
          } else {
            this.$message({
              message: "操作失败！",
              type: "error"
            });
          }
          this.fullscreenLoading = false;
        } else {
          return false;
        }
      });
    },
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
          online,
          this.$store.state.userInfo.username
        )
        .catch(err => {
          return err;
        });
      return res;
    },
    //Dialog 关闭的回调
    closeDialog() {
      let type = this.type == "change" ? "change" : "create";
      this.$emit("closeDialog", type);
    }
  },
  watch: {
    info() {
      this.id = this.info.id;
      console.log(this.id)
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