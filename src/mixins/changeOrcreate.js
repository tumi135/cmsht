export const changeOrcreateMixins = {
  methods: {
    //上传本地图片
    async uploaderImg(file) {
      var isLt1M, big
      if (this.$route.name == "articleType") {
        isLt1M = file.size / 1024 / 1024 < 0.1;
        big = 100
      } else {
        isLt1M = file.size / 1024 / 1024 < 0.5;
        big = 500
      }
      console.log(isLt1M)
      if (!isLt1M) {
        this.$message.error(`上传文件大小不能超过 ${big}k!`);
        return false;
      }
      let reader = new FileReader(); //html5读文件
      let that = this;
      
      reader.readAsDataURL(file.raw); //转BASE64
      reader.onload = async function () {
        //读取完毕后调用接口
        let myImg = await that.$api
          .uploadImgByBase64(reader.result, "article_type")
          .catch(err => {
            return err;
          });
        if (myImg.ret == 200 && myImg.data.err_code == 0) {
          that.form.litpic = myImg.data.url;
        } else {
          that.$message({
            message: "图片上传失败,刷新或换图片！",
            type: "error"
          });
        }
      };
    },
    //Dialog 关闭的回调
    closeDialog() {
      let type = this.type == "change" ? "change" : "create";
      this.$emit("closeDialog", type);
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
            this.$router.go(0);
          } else if (res.ret == 200 && res.data.err_code == 1){
            this.$message({
              message: "你不是管理员，无权限操作!",
              type: "warning"
            });
          } else if (res == "请登录后再操作") {
            this.$message({
              message: "请登录后再操作!",
              type: "warning"
            });
          } else if (res == "取消操作") {
            this.$message({
              message: "取消操作成功!",
              type: "info"
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
    }
  }
}