import Vue from "vue";
import store from "../store/index";

import VueRouter from "vue-router";
const Layout = () => import("../components/layout.vue");
const Login = () => import("../views/login.vue");
const Register = () => import("../views/register");
const Index = () => import("../views/index");

Vue.use(VueRouter);

const routes = [
  {
    path: "/index",
    name: "index",
    component: Index
  },
  {
    path: "/blank",
    name: "blankPage",
    component: Layout,
    children: [
      {
        path: "login",
        name: "login",
        component: Login
      },
      {
        path: "register",
        name: "register",
        component: Register
      }
    ]
  }
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (store.state.token) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;
