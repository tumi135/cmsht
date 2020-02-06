<template>
  <div>
    <header class="article-header">编辑文章</header>
    <change-orcreate type="change" :info="changeInfo" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      changeInfo: {},
      articleId: ""
    };
  },
  async created() {
    this.articleId = this.$route.query.articleId;
    this.initData();
  },
  methods: {
    async initData() {
      this.fullscreenLoading = true;
      let articleId = this.$route.query.articleId;

      let datas = await this.$api.getArticle(articleId).catch(() => {
        // console.log(err);
        this.$message.error("数据获取失败");
        return "";
      });
      // console.log(datas);

      this.changeInfo = datas.data.data || {};
      this.fullscreenLoading = false;
    }
  },
  watch: {
    // articleId: function() {
    //   this.initData();
    // },
    "$route.query.articleId": {
      handler() {
        // console.log('aaaa');
        this.initData();
      },
      immediate: true,
      deep: true
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.articleId = to.query.articleId;
  //   });
  // },
  // beforeRouteUpdate(to, from, next) {
  //   this.articleId = to.query.articleId;
  //   next();
  // },
  components: {
    changeOrcreate: () => import("../components/article/changeOrcreate")
  }
};
</script>

<style scoped>
.article-header {
  text-align: center;
  padding-bottom: 20px;
  font-size: 28px;
}
</style>
