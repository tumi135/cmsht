import axios from 'axios'
import store from "../store/index";
import storages from '../my_config/storages'

var API_BASE_URL = 'http://hn216.api.yesapi.cn'
var timeout = 60000
const baseRequest = axios.create({
  baseURL: API_BASE_URL, // api 的 base_url
  timeout: timeout // 请求超时时间
})
// request拦截器
baseRequest.interceptors.request.use(
  config => {
    //在发送请求之前做些什么
    if(config.params.token){
      config.params.token = store.state.token
    }
    if(config.params.uuid){
      config.params.uuid = store.state.uuid
    }
    if(config.params.admin_token){
          config.params.admin_token = store.state.token
        }
    if(config.params.admin_uuid){
              config.params.admin_uuid = store.state.uuid
            }
    config.params = {
      app_key: 'C6FB2E902F9FDA74101B4887AF935333',
      ...config.params
    }
    // if (!config.noToken) {
    //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }

    return config
  },
  error => {
    // Do something with request error
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
baseRequest.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

const request = (url, needSubDomain, method, data) => {
  const _url = url
  return baseRequest({
    url: _url,
    needSubDomain: needSubDomain,
    method: method,
    params: method == 'get' || method == 'GET' ? data : {},
    data: method == 'post' || method == 'POST' ? data : {},
  })
}

export default request