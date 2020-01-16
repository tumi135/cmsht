<template>
  <div class="login">
    <el-form
      class="login_from"
      :model="form"
      :rules="rules"
      ref="login_from"
      label-width="80px"
      size="small"
    >
      <el-form-item label="账号" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
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
          >登录</el-button
        >
      </el-form-item>
    </el-form>
    <div class="from_tips">
      <div class="my_login_error" v-show="alert">{{ alert }}</div>
      <p>
        还没账号？
        <router-link class="go_register" :to="{ name: 'register' }"
          >注册</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
// import storages from "../my_config/storages";
export default {
  data() {
    return {
      form: {
        name: "",
        password: "",
        captcha_code: ""
      },
      rules: {
        name: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
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
    ...mapMutations(["login"]),
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
    //检验验证码，正确则发送登录
    checkChaInfo() {
      this.alert = "";
      this.$refs.login_from.validate(async valid => {
        if (valid) {
          this.fullscreenLoading = true;
          let captchaCheckInfo = await this.$api
            .captchaVerify(this.captcha_id, this.form.captcha_code)
            .catch(() => {
              return "网络错误";
            });
          if (
            captchaCheckInfo.ret == 200 &&
            captchaCheckInfo.data.err_code == 0
          ) {
            this.goLogin();
          } else if (captchaCheckInfo == "网络错误") {
            this.fullscreenLoading = false;
            this.alert = captchaCheckInfo;
          } else {
            this.fullscreenLoading = false;
            this.alert = captchaCheckInfo.data.err_msg;
          }
        }
      });
    },
    async goLogin() {
      let loginInfo = await this.$api
        .userLogin(this.form.name, this.form.password)
        .catch(() => {
          return "网络错误";
        });
      this.fullscreenLoading = false;
      if (loginInfo.ret == 200 && loginInfo.data.err_code == 0) {
        this.$message({
          message: "登录成功！",
          type: "success"
        });
        this.login(loginInfo.data);
        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else {
          this.$router.push({ name: "home" });
        }
      } else if (loginInfo == "网络错误") {
        this.alert = loginInfo;
      } else {
        this.alert = loginInfo.data.err_msg;
      }
    }
  }
};
</script>

<style scoped>
.login {
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
.go_register {
  color: red;
  text-decoration: none;
}
.my_login_error {
  text-align: center;
  font-size: 14px;
  color: red;
  height: 30px;
}
</style>
