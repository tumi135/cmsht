<template>
  <el-row>
    <el-col :span="18" class="header-left">
      <div class="hamburger-container" @click="changeHamburger">
        <i class="el-icon-s-fold" v-show="!hamburger"></i>
        <i class="el-icon-s-unfold" v-show="hamburger"></i>
      </div>
      <router-link class="logo_title" to="/home" title="宠萌管理后台">
        <img src="../../assets/images/logo.png" alt="宠萌logo" />
      </router-link>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>宠萌管理后台</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in routerName" :key="index">
          {{
          item
          }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="6">
      <el-dropdown>
        <div class="avatar_name">
          <img :src="avatar" class="avatar" />
          {{ userName }}
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/my" class="toOther">修改个人资料</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <router-link to="/changePassword" class="toOther">修改密码</router-link>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="toLogout">退出</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import Bus from "../../utils/bus";
import { mapMutations, mapState } from "vuex";
export default {
  name: "",
  data() {
    return {
      routerName: [],
      hamburger: false,
      avatar: null,
      userName: ""
    };
  },
  async created() {
    this.routerName = this.$route.meta.routerName;
    let userInfo = await this.$api.userProfile();
    if (userInfo.ret == 200 && userInfo.data.err_code == 0) {
      this.changeInfo(userInfo.data.info);
      this.saveUserInfo(userInfo.data.info);
    }
  },
  methods: {
    ...mapMutations(["saveUserInfo", "logout"]),
    changeHamburger() {
      this.hamburger = !this.hamburger;
      Bus.$emit("changeCollapse", this.hamburger);
    },
    toLogout() {
      this.logout();
      this.$router.push("/layout/login");
    },
    changeInfo(data) {
      this.userName = data.username;
      this.avatar = data.ext_info.yesapi_avatar;
    }
  },
  watch: {
    $route() {
      this.routerName = this.$route.meta.routerName;
    },
    //监听用户信息
    userInfo(v) {
      this.changeInfo(v);
    }
  },
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>

<style scoped>
.el-row,
.el-col {
  height: 100%;
}
.header-left {
  display: flex;
  align-items: center;
  font-size: 16px;
}
.hamburger-container {
  margin-right: 20px;
  font-size: 20px;
}
.logo_title {
  height: 100%;
  display: flex;
  align-items: center;
}
.logo_title > img {
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
.el-dropdown {
  height: 100%;
  width: 100%;
}
.avatar_name {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 14px;
}
.el-dropdown-menu__item {
  text-align: center;
}
.toOther {
  color: #606266;
  text-decoration: none;
}
</style>
