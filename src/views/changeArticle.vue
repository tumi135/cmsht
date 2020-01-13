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
      changeInfo: {}
    };
  },
  async created() {
    this.initData();
  },
  methods: {
    async initData() {
      this.fullscreenLoading = true;

      let datas = await this.$api
        .getArticle(this.$route.query.articleId)
        .catch(err => {
          console.log(err);
          this.$message.error("数据获取失败");
          return "";
        });

      this.changeInfo = datas.data.data || {};
      console.log(this.changeInfo);
      this.fullscreenLoading = false;
    }
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