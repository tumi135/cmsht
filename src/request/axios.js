import axios from "axios";
import qs from "qs";
// import store from "../store/index";
import storages from "../my_config/storages";

// request拦截器
axios.defaults.baseURL = "http://hn216.api.yesapi.cn";
axios.defaults.timeout = 6000;
axios.interceptors.request.use(
  config => {
    //在发送请求之前做些什么
    if (config.data.token) {
      config.data.token = storages.sessionGet("token");
    }
    if (config.data.uuid) {
      config.data.uuid = storages.sessionGet("uuid");
    }
    if (config.data.admin_token) {
      config.data.token = storages.sessionGet("token");
    }
    if (config.data.admin_uuid) {
      config.data.uuid = storages.sessionGet("uuid");
    }
    config.data = {
      ...config.data,
      app_key: "C6FB2E902F9FDA74101B4887AF935333"
    };
    if (config.data) {
      config.data = qs.stringify(config.data);
    }
    // if (!config.noToken) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }

    return config;
  },
  error => {
    // Do something with request error
    console.error(error); // for debug
    console.error("error");
    return Promise.reject(error);
  }
);

// response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    console.error(error); // for debug
    return Promise.reject(error);
  }
);

export default axios;
