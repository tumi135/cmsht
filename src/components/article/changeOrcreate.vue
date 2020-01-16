<template class="changeOrcreate">
  <div>
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="内容" prop="content">
        <el-input
          v-model="form.content"
          maxlength="800"
          type="textarea"
          :autosize="{ minRows: 3 }"
          show-word-limit
          class="conten_input"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="type_id">
        <el-select v-model="form.type_id" placeholder="请选择">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.type_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推荐等级" prop="tuijian">
        <el-input
          v-model="form.tuijian"
          maxlength="2"
          show-word-limit
          placeholder="100以内正整数，数字越大越可能上首页"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="pic">
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
          :limit="9"
          :class="{ hide: hideUploadEdit }"
          accept=".jpg, .jpeg, .png, .gif, .bmp, .pdf, .JPG, .JPEG, .PBG, .GIF, .BMP, .PDF"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-form-item>
      <el-form-item label="上架">
        <el-switch
          v-model="form.online"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goBack">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        v-loading.fullscreen.lock="fullscreenLoading"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    info: Object
  },
  data() {
    var myReg = /^[1-9][0-9]*$/;
    var listorderValidator = (rule, value, callback) => {
      if (!myReg.test(value) || value > 99) {
        return callback(new Error("请填写100以内正整数!!"));
      }
      callback();
    };
    return {
      typeList: [],
      fullscreenLoading: false,
      id: "",
      form: {
        type_id: "",
        content: "",
        pic: [],
        tuijian: null,
        online: true
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      hideUploadEdit: false,
      formRules: {
        type_id: [{ required: true, message: "请选择分类", trigger: "blur" }],
        content: [{ required: true, message: "请填写内容", trigger: "blur" }],
        tuijian: [
          { required: true, validator: listorderValidator, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.initTypeList();
  },
  methods: {
    //初始化分类
    async initTypeList() {
      let datas = await this.$api.articleTypeFreeQuery(1, 30).catch(err => {
        console.log(err);
        this.$message.error("数据获取失败");
        return "";
      });
      this.typeList = datas.data.list || [];
    },
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
          that.hideUploadEdit = fileList.length >= 9;
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
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //删除图片
    handleRemove(file, fileList) {
      this.form.pic = fileList;
      this.hideUploadEdit = fileList.length >= 9;
    },
    //提交表单
    async submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.fullscreenLoading = true;
          var res;
          if (this.type == "change") {
            res = await this.submitChange();
          } else if (this.type == "create") {
            res = await this.submitCreate();
          } else {
            this.$message({
              message: "操作失败！",
              type: "error"
            });
            return false;
          }
          if (res.ret == 200 && res.data.err_code == 0) {
            this.$message({
              message: "操作成功!",
              type: "success"
            });
            // this.$router.go(0);
            this.goBack();
          } else if (res == "请登录后再操作") {
            this.$message({
              message: "请登录后再操作!",
              type: "warning"
            });
          } else {
            this.$message({
              message: "网络错误，操作失败！",
              type: "error"
            });
          }
          this.fullscreenLoading = false;
        } else {
          return false;
        }
      });
    },
    //返回上一页
    goBack() {
      this.$router.go(-1);
    },
    async submitChange() {
      let pics = JSON.stringify({ pic: this.form.pic });
      let online = this.form.online ? 0 : 1;
      let res = await this.$api
        .articleChange(
          this.id,
          this.form.type_id,
          this.form.content,
          online,
          this.form.tuijian,
          pics
        )
        .catch(err => {
          return err;
        });
      return res;
    },
    async submitCreate() {
      let pics = JSON.stringify({ pic: this.form.pic });
      let online = this.form.online ? 0 : 1;
      let res = await this.$api
        .createArticle(
          this.form.type_id,
          this.form.content,
          online,
          this.form.tuijian,
          pics
        )
        .catch(err => {
          return err;
        });
      return res;
    }
  },
  watch: {
    info() {
      let litpic = JSON.parse(this.info.litpic);
      var pics;
      if (litpic) {
        pics = litpic.pic;
        console.log(pics);
      } else {
        pics = [];
      }
      this.id = this.info.id;
      this.form = {
        type_id: this.info.type_id,
        content: this.info.content,
        pic: pics,
        tuijian: this.info.tuijian,
        online: this.info.online == 0 ? true : false
      };
    },
    $router(){
      this.initTypeList();
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
.el-input,
.conten_input {
  width: 300px;
}
</style>
<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
