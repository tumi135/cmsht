<template>
  <div>
    <header class="article-header">创建文章</header>
    <change-orcreate type="create"/>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
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