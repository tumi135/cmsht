<template>
  <div class="login">
    <div class="from_tips">
      <p>
        还没账号？<router-link :to="{ name: 'register' }">注册</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      password: ""
    };
  },
  created() {}
};
</script>

<style scoped>

</style>
