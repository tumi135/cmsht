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
  },
  methods: {
    async initData() {
      this.fullscreenLoading = true;

      let datas = await this.$api.getArticle(this.articleId).catch(err => {
        console.log(err);
        this.$message.error("数据获取失败");
        return "";
      });

      this.changeInfo = datas.data.data || {};
      this.fullscreenLoading = false;
    }
  },
  watch: {
    articleId: function() {
      this.initData();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.articleId = to.query.articleId;
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.articleId = to.query.articleId;
    next();
  },
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