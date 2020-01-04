<template>
  <div class="register">
    <el-form
      class="register_from"
      :model="form"
      :rules="rules"
      ref="register_from"
      label-width="80px"
      size="small"
    >
      <el-form-item label="账号" prop="name">
        <el-input v-model="form.name" placeholder="请输入4-8位字母或数字"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入6-12位小写字母或数字"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="form.checkPassword" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="captcha_code">
        <el-input class="captcha" v-model="form.captcha_code"></el-input>
        <img
          class="captcha_img"
          @click="getCaptchaInfo"
          :src="'data:image/jpeg;base64,' + captcha_img"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="checkChaInfo"
          v-loading.fullscreen.lock="fullscreenLoading"
          element-loading-text="拼命加载中"
        >注册</el-button>
      </el-form-item>
    </el-form>
    <div class="from_tips">
      <div class="my_register_error" v-show="alert">{{alert}}</div>
      <p>
        已有账号？
        <router-link class="go_login" :to="{ name: 'login' }">登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var nameReg = /^[0-9a-zA-Z]{4,6}$/;
    var passwordReg = /^[0-9a-z]{6,12}$/;
    var nameValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入账号!"));
      }
      if (!nameReg.test(value)) {
        return callback(new Error("账号格式不对!"));
      }
      callback();
    };
    var passwordValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码!"));
      }
      if (!passwordReg.test(value)) {
        return callback(new Error("密码格式不对!!"));
      }
      callback();
    };
    var checkPasswordValidator = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码!"));
      }
      if (value !== this.form.password) {
        return callback(new Error("两次输入密码不一致!"));
      }
      callback();
    };
    return {
      form: {
        name: "",
        password: "",
        checkPassword: "",
        captcha_code: ""
      },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: "blur" }],
        password: [
          { required: true, validator: passwordValidator, trigger: "blur" }
        ],
        checkPassword: [
          { required: true, validator: checkPasswordValidator, trigger: "blur" }
        ],
        captcha_code: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      },
      captcha_id: "",
      captcha_img: "",
      alert: "",
      fullscreenLoading: false
    };
  },
  created() {
    this.getCaptchaInfo();
  },
  methods: {
    async getCaptchaInfo() {
      let captchaInfo = await this.$api.captchaCreate().catch(() => {
        this.$message({
          message: "验证码获取失败！",
          type: "error"
        });
      });
      if (captchaInfo.ret == 200 && captchaInfo.data.err_code == 0) {
        this.captcha_img = captchaInfo.data.captcha_img;
        this.captcha_id = captchaInfo.data.captcha_id;
      }
    },
    checkChaInfo() {
      this.alert = "";
      this.$refs.register_from.validate(async valid => {
        if (valid) {
          this.fullscreenLoading = true;
          let captchaCheckInfo = await this.$api
            .captchaVerify(this.captcha_id, this.form.captcha_code)
            .catch(() => {
              this.$message({
                message: "注册失败！",
                type: "error"
              });
            });
          if (
            captchaCheckInfo.ret == 200 &&
            captchaCheckInfo.data.err_code == 0
          ) {
            this.goRrgister();
          } else {
            this.fullscreenLoading = false;
            this.alert = captchaCheckInfo.data.err_msg;
          }
        }
      });
    },
    async goRrgister() {
      let loginInfo = await this.$api
        .userRegister(this.form.name, this.form.password)
        .catch(() => {
          this.$message({
            message: "注册失败！",
            type: "error"
          });
        });
      this.fullscreenLoading = false;
      if (loginInfo.ret == 200 && loginInfo.data.err_code == 0) {
        this.$message({
          message: "注册成功！",
          type: "success"
        });
        this.$router.push({ name: "login" });
      } else {
        this.alert = loginInfo.data.err_msg;
      }
    }
  }
};
</script>

<style scoped>
.register {
  padding: 30px 10px 30px;
}

.el-input {
  width: 200px;
}
.captcha {
  width: 80px;
  display: inline-block;
}
.captcha_img {
  display: inline-block;
  height: 28px;
  margin-left: 10px;
  vertical-align: middle;
}
p {
  text-align: center;
}
.go_login {
  color: red;
  text-decoration: none;
}
.my_register_error {
  text-align: center;
  font-size: 14px;
  color: red;
  height: 30px;
}
</style>
