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
const Banner = () => import("../views/banner");
const FunnyImg = () => import("../views/funnyImg");
const Announcements = () => import("../views/announcements");
const AarticleType = () => import("../views/articleType");
const Aarticle = () => import("../views/article");
const CreateArticle = () => import("../views/createArticle");
const ChangeArticle = () => import("../views/changeArticle");
const CommentList = () => import("../views/commentList");
const FeedbackTips = () => import("../views/feedbackTips");
const FeedbackList = () => import("../views/feedbackList");

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
      {
        path: "banner",
        name: "banner",
        component: Banner,
        meta: {
          requireAuth: true,
          routerName: ['系统设置', '轮播图']
        }
      },
      {
        path: "announcements",
        name: "announcements",
        component: Announcements,
        meta: {
          requireAuth: true,
          routerName: ['系统设置', '公告']
        }
      },
      {
        path: "funnyImg",
        name: "funnyImg",
        component: FunnyImg,
        meta: {
          requireAuth: true,
          routerName: ['系统设置', '趣图']
        }
      },
      {
        path: "articleType",
        name: "articleType",
        component: AarticleType,
        meta: {
          requireAuth: true,
          routerName: ['文章管理', '文章分类']
        }
      },
      {
        path: "article",
        name: "article",
        component: Aarticle,
        meta: {
          requireAuth: true,
          routerName: ['文章管理', '文章列表']
        }
      },
      {
        path: "createArticle",
        name: "createArticle",
        component: CreateArticle,
        meta: {
          requireAuth: true,
          routerName: ['文章管理', '创建文章']
        }
      },
      {
        path: "changeArticle",
        name: "changeArticle",
        component: ChangeArticle,
        meta: {
          requireAuth: true,
          routerName: ['文章管理', '编辑文章']
        }
      },
      {
        path: "commentList",
        name: "commentList",
        component: CommentList,
        meta: {
          requireAuth: true,
          routerName: ['文章管理', '评论列表']
        }
      },
      {
        path: "feedbackTips",
        name: "feedbackTips",
        component: FeedbackTips,
        meta: {
          requireAuth: true,
          routerName: ['意见反馈', '意见反馈告示']
        }
      },
      {
        path: "feedbackList",
        name: "feedbackList",
        component: FeedbackList,
        meta: {
          requireAuth: true,
          routerName: ['意见反馈', '意见反馈列表']
        }
      }
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