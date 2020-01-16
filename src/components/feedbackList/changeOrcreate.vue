<template class="changeOrcreateBanner">
  <el-dialog
    title="回复反馈"
    :visible.sync="dialogFormVisible"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      
      <el-form-item label="被回复的人" >
        <el-input v-model="form.rName" maxlength="20" show-word-limit readonly></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          maxlength="300"
          type="textarea"
          :autosize="{ minRows: 3 }"
          show-word-limit
          class="conten_input"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          list-type="picture-card"
          ref="upload"
          class="my-uploader"
          action
          :auto-upload="false"
          :on-change="uploaderImgs"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="form.pic"
          :limit="4"
          :class="{ hide: hideUploadEdit }"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
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
import { changeOrcreateMixins } from "../../mixins/changeOrcreate";

export default {
  props: {
    dialogFormVisible: Boolean,
    rName: String
  },
  mixins: [changeOrcreateMixins],
  data() {
    return {
      type: "create",
      fullscreenLoading: false,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      hideUploadEdit: false,
      form: {
        rName: "",
        content: "",
        pic: []
        
      },
      formRules: {
        content: [{ required: true, message: "请填写内容", trigger: "blur" }],
      }
    };
  },
  created() {
    // console.log(this.type);
  },
  methods: {
    //上传本地图片
    async uploaderImgs(file, fileList) {
      var isLt1M, big;
      isLt1M = file.size / 1024 / 1024 < 0.5;
      big = 500;
      console.log(isLt1M);
      if (!isLt1M) {
        this.$message.error(`上传文件大小不能超过 ${big}k!`);
        return false;
      }
      let reader = new FileReader(); //html5读文件
      let that = this;

      reader.readAsDataURL(file.raw); //转BASE64
      reader.onload = async function() {
        //读取完毕后调用接口
        let myImg = await that.$api
          .uploadImgByBase64(reader.result, "article_type")
          .catch(err => {
            return err;
          });
        if (myImg.ret == 200 && myImg.data.err_code == 0) {
          that.form.pic.push({
            url: myImg.data.url,
            name: "article_type"
          });
          that.hideUploadEdit = fileList.length >= 4;
        } else {
          that.$message({
            message: "图片上传失败,刷新或换图片！",
            type: "error"
          });
        }
      };
    },
    //图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //删除图片
    handleRemove(file, fileList) {
      this.form.pic = fileList;
      this.hideUploadEdit = fileList.length >=4;
    },
    async submitCreate() {
      let pics = JSON.stringify({ pic: this.form.pic });
      let res = await this.$api
        .createFeedback(
          this.form.content,
          this.form.rName,
          pics
        )
        .catch(err => {
          return err;
        });
      return res;
    }
  },
  watch: {
    rName() {
      this.form = {
        rName: this.rName,
        content: "",
        pic: []
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