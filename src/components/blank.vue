<template>
  <el-container>
    <el-aside width="">
      <blank-aside />
    </el-aside>
    <el-container>
      <el-header>
        <blank-header />
      </el-header>
      <el-main>
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import BlankHeader from "./blank/blank_header";
import BlankAside from "./blank/blank_aside";
export default {
  name: "",
  data() {
    return {};
  },
  components: {
    BlankHeader,
    BlankAside
  }
};
</script>

<style scoped>
@import "../assets/css/base.css";
.el-container {
  height: 100%;
}
.el-header {
  /* background:#8000ff; */
  border-bottom: 1px solid #e6e6e6;
}
.el-aside {
  /* background: #ff80c0; */
  border-right: 1px solid #e6e6e6;
}
.el-main {
  /* background: #c0c0c0; */
}
</style>