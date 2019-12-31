<template>
  <div>
    <el-form label-width="80px" :model="myUserInfo" ref="myUserInfo">
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action
          :auto-upload="false"
          :show-file-list="false"
          :on-change="changeAvatar"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="myUserInfo.avatar" :src="myUserInfo.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="myUserInfo.email"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }
          ]"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="myUserInfo.sex"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">修改</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="头像剪裁" width="500px" :visible.sync="dialogVisible" append-to-body>
      <div class="dialog-cropper-center">
        <div class="cropper-content">
        <div class="cropper" >
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            @realTime="realTime"
          ></vueCropper>
        </div>
      </div>
      <div :style="previewStyle" class="previewStyle">
        <div :style="previews.div">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { VueCropper } from "vue-cropper";

export default {
  data() {
    return {
      myUserInfo: {
        avatar: "",
        email: "",
        sex: ""
      },
      previews: {},
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      previewStyle: {},
      picsList: [], //页面显示的数组
      // 防止重复提交
      loading: false
    };
  },
  components: {
    VueCropper
  },
  created() {
    if (this.userInfo) {
      this.myUserInfo.avatar = this.userInfo.ext_info.yesapi_avatar || "";
      this.myUserInfo.email = this.userInfo.ext_info.yesapi_email || "";
      this.myUserInfo.asex = this.userInfo.ext_info.yesapi_sex || "";
    }
  },
  methods: {
    ...mapMutations(["saveUserInfo"]),
    changeAvatar(file) {
      const isLt5M = file.size / 1024 / 1024 < 1;
      if (!isLt5M) {
        this.$message.error("上传文件大小不能超过 1MB!");
        return false;
      }
      this.fileinfo = file;

      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = URL.createObjectURL(file.raw);
        console.log(this.option.img);
        this.dialogVisible = true;
      });
    },
    // 实时预览函数
    realTime(data) {
      console.log(data);
      this.previews = data;

      this.previewStyle = {
        width: data.w + "px",
        height: data.h + "px",
        overflow: "hidden",
        margin: "0",
        zoom: 100 / data.w
      };
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);

      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    finish() {
      this.$refs.cropper.getCropBlob(data => {
        console.log(data);
        // var fileName = 'goods' + this.fileinfo.uid
        // this.loading = true
        //上传阿里云服务器
        // client().put(fileName, data).then(result => {
        //   this.dialogVisible = false
        //   this.picsList.push(result.url)
        // }).catch(err => {
        //   console.log(err)
        //   this.loading = false
        // })
      });
    },
    submitForm() {
      this.$refs.myUserInfo.validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    userInfo() {
      console.log("-----");
      console.log(this.userInfo);
      this.myUserInfo.avatar = this.userInfo.ext_info.yesapi_avatar || "";
      this.myUserInfo.email = this.userInfo.ext_info.yesapi_email || "";
      this.myUserInfo.sex = this.userInfo.ext_info.yesapi_sex || "";
      console.log(this.myUserInfo.sex);
    }
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.dialog-cropper-center {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.cropper {
  width: 300px;
  height: 300px;
}

.previewStyle{
  border-radius: 50%;
  display: inline-block;
  /* margin-left: 50px; */
}
</style>