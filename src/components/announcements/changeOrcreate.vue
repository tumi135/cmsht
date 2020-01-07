<template class="changeOrcreate">
  <el-dialog
    :title="type == 'change' ? '编辑公告' : '创建公告'"
    :visible.sync="dialogFormVisible"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" maxlength="20" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="起始时间">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input
          type="textarea"
          :rows="5"
          clearable
          placeholder="请输入内容"
          maxlength="300"
          show-word-limit
          v-model="form.content"
        ></el-input>
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
        date: "",
        content: "",
        online: true
      },
      formRules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        content: [{ required: true, message: "请填写内容", trigger: "blur" }]
      }
    };
  },
  created() {
    // console.log(this.type);
  },
  methods: {
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
    async submitChange() {
      var strTime, endTime;
      if (this.form.date) {
        strTime = this.formatDate(this.form.date[0]);
        endTime = this.formatDate(this.form.date[1]);
      } else {
        strTime = null;
        endTime = null;
      }
      let online = this.form.online ? 0 : 1;
      let res = await this.$api
        .announcementsChange(
          this.id,
          this.form.title,
          this.form.content,
          online,
          strTime,
          endTime
        )
        .catch(err => {
          return err;
        });
      return res;
    },
    async submitCreate() {
      var strTime, endTime;
      if (this.form.date) {
        strTime = this.formatDate(this.form.date[0]);
        endTime = this.formatDate(this.form.date[1]);
      } else {
        strTime = null;
        endTime = null;
      }
      let online = this.form.online ? 0 : 1;
      let res = await this.$api
        .createAnnouncements(
          this.form.title,
          this.form.content,
          online,
          strTime,
          endTime
        )
        .catch(err => {
          return err;
        });
      console.log(res);
      return res;
    },
    //Dialog 关闭的回调
    closeDialog() {
      let type = this.type == "change" ? "change" : "create";
      this.$emit("closeDialog", type);
    },
    formatDate(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
  },
  watch: {
    info() {
      let strTime = new Date(Date.parse(this.info.start_time.replace(/-/g,  "/")));
      let endTime = new Date(Date.parse(this.info.end_time.replace(/-/g,  "/")));
      let date = [strTime,endTime];
      this.id = this.info.id;
      this.form = {
        title: this.info.title,
        content: this.info.content,
        date: date,
        online: this.info.online == 0 ? true : false
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