<template>
  <el-row>
    <el-col :span="16" class="header-left">
      <div class="hamburger-container" @click="changeHamburger">
        <i class="el-icon-s-fold" v-show="!hamburger"></i>
        <i class="el-icon-s-unfold" v-show="hamburger"></i>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in routerName" :key="index">{{
          item
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="8"></el-col>
  </el-row>
</template>

<script>
import Bus from "../../utils/bus";
export default {
  name: "",
  data() {
    return {
      routerName: [],
      hamburger: false
    };
  },
  created() {
    console.log(this.$route);
    this.routerName = this.$route.meta.routerName;
  },
  methods: {
    changeHamburger() {
      this.hamburger = !this.hamburger;
      Bus.$emit("changeCollapse", this.hamburger);
    }
  },
  watch: {
    $route() {
      this.routerName = this.$route.meta.routerName;
    }
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
</style>
