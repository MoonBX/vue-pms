/**
 * Created by zhongyuqiang on 2017/10/9.
 */
import axios from 'axios'
axios.defaults.baseURL = 'http://114.55.143.170:8082';

axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
  if (localStorage.vueToken) {
    config.headers.token = localStorage.vueToken;
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

export function fetch(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params})
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  /**
   * 用户登录
   */
  Login(params) {
    return fetch('/account/login', params)
  },

  Logout() {
    return get('/account/logout')
  }
}