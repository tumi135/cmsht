<template>
  <el-menu
    :default-active="defaultActive"
    unique-opened
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    router
  >
    <el-menu-item index="home">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span slot="title">系统设置</span>
      </template>
      <el-menu-item index="banner">轮播图</el-menu-item>
      <el-menu-item index="announcements">公告</el-menu-item>
      <el-menu-item index="funnyImg">趣图</el-menu-item>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-notebook-1"></i>
        <span slot="title">文章管理</span>
      </template>
      <el-menu-item index="articleType">文章分类</el-menu-item>
      <el-menu-item index="article">文章列表</el-menu-item>
      <el-menu-item index="createArticle">创建文章</el-menu-item>
      <el-menu-item index="commentList">评论列表</el-menu-item>
    </el-submenu>
    <el-submenu index="4">
      <template slot="title">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">意见反馈</span>
      </template>
      <el-menu-item index="feedbackTips">意见反馈告示</el-menu-item>
      <el-menu-item index="feedbackList">意见反馈列表</el-menu-item>
    </el-submenu>
    <el-submenu index="5">
      <template slot="title">
        <i class="el-icon-s-custom"></i>
        <span slot="title">用户管理</span>
      </template>
      <el-menu-item index="userList">用户列表</el-menu-item>
      <el-menu-item index="getLastestLoginList"
        >近期登录的前20名用户</el-menu-item
      >
    </el-submenu>
  </el-menu>
</template>

<script>
import Bus from '../../utils/bus';
export default {
  name: '',
  data() {
    return {
      isCollapse: false
    };
  },
  mounted() {
    Bus.$on('changeCollapse', data => {
      this.isCollapse = data;
    });
  },
  methods: {},
  computed: {
    defaultActive: function() {
      return this.$route.path.replace('/', '');
    }
  }
};
</script>

<style scoped>
.el-menu-vertical-demo {
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
