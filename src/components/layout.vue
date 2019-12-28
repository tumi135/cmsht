<template class="layout">
  <div class="bg">
    <div class="bg_animation">
      <img class="cat" src="../assets/images/cat.png" />
      <img class="dog" src="../assets/images/dog.png" />
      <img class="logo" src="../assets/images/logo.png" />
      <h1>
        <a class="logoHref" href="#">宠萌欢迎您！</a>
      </h1>
    </div>
    <div class="login_register_from_box">
      <div class="wrapper_from_box">
        <p>宠萌管理后台</p>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  }
};
</script>
<style>
/* html,
body,
#app,
.layout {
  height: 100%;
  width: 100%;
} */
</style>
<style scoped>
@import "../assets/css/base.css";
.bg {
  height: 100vh;
  width: 100vw;
  background: #ffffff;
  background-image: url("../assets/images/bg.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: bottom center;
  background-size: 35%;
}
.bg_animation {
  position: relative;
  width: calc(100% - 330px);
  height: 100%;
}
.cat,
.dog,
.logo {
  width: 130px;
  position: absolute;
}
.logo {
  top: 105px;
  left: 125px;
  width: 0;
  animation: logoAnimation 3s ease 3500ms 1 forwards;
}
.dog {
  animation: dogAnimation 4s ease 0s 1 forwards;
}
.cat {
  animation: catAnimation 4s ease 0s 1 forwards;
}
h1 {
  position: absolute;
  left: 30px;
  top: 160px;
  filter: opacity(0);
  animation: h1Animation 3s linear 3500ms 1 forwards;
}
.logoHref {
  text-decoration: none;
  color: #000000;
}
@keyframes catAnimation {
  from {
    top: -130px;
    left: 100%;
    filter: opacity(100%);
  }
  to {
    top: 30px;
    left: 50px;
    filter: opacity(0);
  }
}
@keyframes dogAnimation {
  from {
    top: 100%;
    left: -130px;
    filter: opacity(100%);
  }
  to {
    top: 30px;
    left: 50px;
    filter: opacity(0);
  }
}
@keyframes logoAnimation {
  from {
    top: 105px;
    left: 125px;
    width: 0;
    transform: rotate(0);
  }
  to {
    top: 30px;
    left: 50px;
    width: 130px;
    transform: rotate(3600deg);
  }
}
@keyframes h1Animation {
  0% {
    top: 150px;
    filter: opacity(100%);
  }
  25% {
    top: 170px;
    filter: opacity(100%) drop-shadow(0 15px 5px #000);
  }
  50% {
    top: 150px;
    filter: opacity(100%);
  }
  75% {
    top: 170px;
    filter: opacity(100%) drop-shadow(0 15px 5px #000);
  }
  100% {
    top: 150px;
    filter: opacity(100%);
  }
}
.login_register_from_box {
  position: fixed;
  right: 30px;
  top: 30px;
  width: 320px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
}
.wrapper_from_box {
  background: #ffffff;
}
p {
  font-size: 24px;
  color: #000;
  font-weight: 500;
  text-align: center;
  padding-top: 20px;
}
</style>
