<template class="changeOrcreate">
  <el-dialog
    :title="'修改用户'+ info+ '的密码：'"
    :visible.sync="dialogFormVisible"
    destroy-on-close
    :before-close="closeDialog"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="80px" ref="form" :rules="formRules">
      <el-form-item label="新密码" prop="password">
        <el-input v-model="form.password" show-password placeholder="请输入6-12位小写字母或数字"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input v-model="form.checkPassword" show-password></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
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
    type: String,
    dialogFormVisible: Boolean,
    info: String
  },
    mixins: [changeOrcreateMixins],
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
      fullscreenLoading: false,
      id: "",
      form: {
        password: "",
        checkPassword: ""
      },
      formRules: {
        password: [
          { required: true, validator: passwordValidator, trigger: "blur" }
        ],
        checkPassword: [
          { required: true, validator: checkPasswordValidator, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // console.log(this.type);
  },
  methods: {
    async submitChange() {
      let res = await this.$api
        .resetPasswordForAdmin(
          this.info,
          this.form.password
        )
        .catch(err => {
          return err;
        });
      return res;
    }
  },
  watch: {
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