<template>
  <el-form
    :model="ruleForm"
    status-icon
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="原密码" prop="oldPassword">
      <el-input
        type="password"
        v-model="ruleForm.oldPassword"
        show-password
        placeholder="请输入6-12位小写字母或数字"
      ></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        type="password"
        v-model="ruleForm.newPassword"
        show-password
        placeholder="请输入6-12位小写字母或数字"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="changePassword('ruleForm')"
        v-loading.fullscreen.lock="fullscreenLoading"
        >提交</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    var passwordReg = /^[0-9a-z]{6,12}$/;
    var passwordValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码!"));
      }
      if (!passwordReg.test(value)) {
        return callback(new Error("密码格式不对!!"));
      }
      callback();
    };
    return {
      ruleForm: {
        oldPassword: "",
        newPassword: ""
      },
      rules: {
        oldPassword: [
          { required: true, validator: passwordValidator, trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: passwordValidator, trigger: "blur" }
        ]
      },
      fullscreenLoading: false
    };
  },
  methods: {
    changePassword() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.fullscreenLoading = true;
          let changeInfo = await this.$api.alterPassword(
            this.$store.state.userInfo.username,
            this.ruleForm.oldPassword,
            this.ruleForm.newPassword
          ).catch(err => {
            return err
          });;
          if (changeInfo.ret == 200 && changeInfo.data.err_code == 0) {
            this.$store.commit("logout");
            this.$message({
              message: "修改成功，请重新登录",
              type: "success"
            });
            this.$router.push("/layout/login");
          } else {
            this.$message({
              message: "修改失败！",
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
};
</script>

<style scoped>
.demo-ruleForm {
}
.el-input {
  width: 300px;
}
</style>