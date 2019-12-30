import Vue from "vue";
// import store from "../store/index";
// import storages from "../my_config/storages"
import api from "../request/api.js";

import VueRouter from "vue-router";
const Layout = () => import("../components/layout.vue");
const Blank = () => import("../components/blank.vue");
const Login = () => import("../views/login.vue");
const Register = () => import("../views/register");
const Index = () => import("../views/index");
const Home = () => import("../views/home");
const My = () => import("../views/my");
const ChangePassword = () => import("../views/changePassword");

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Blank,
    redirect: "/home",
    children: [
      {
        path: "index",
        name: "index",
        component: Index,
        meta: {
          requireAuth: true,
          routerName: ['index','index2']
        }
      },
      {
        path: "home",
        name: "home",
        component: Home,
        meta: {
          requireAuth: true,
          routerName: ['首页']
        }
      },
      {
        path: "my",
        name: "my",
        component: My,
        meta: {
          requireAuth: true,
          routerName: ['个人资料']
        }
      },
      {
        path: "changePassword",
        name: "changePassword",
        component: ChangePassword,
        meta: {
          requireAuth: true,
          routerName: ['修改密码']
        }
      },
    ]
  },
  {
    path: "/layout",
    name: "layout",
    component: Layout,
    children: [{
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

router.beforeEach(async (to, from, next) => {
  let checkLogin = await api.userCheck();
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (checkLogin.ret == 200 && checkLogin.data.err_code == 0) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: "/layout/login",
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    //已登录的，跳回首页
    if (checkLogin.ret == 200 && checkLogin.data.err_code == 0) {
      next("/home");
    } else {
      next();
    }
  }
});

export default router;