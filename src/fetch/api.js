/**
 * Created by zhongyuqiang on 2017/10/9.
 */
import axios from 'axios'
axios.defaults.baseURL = 'http://114.55.143.170:8082';

axios.interceptors.request.use(function (config) {    // 这里的config包含每次请求的内容
  if (localStorage.vueToken) {
    if(config.url.split('/')[config.url.split('/').length-1]!=='login'){
      // 给login请求之外的所有请求添加header: token
      config.headers.token = localStorage.vueToken;
    }
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

export function login(url, params) {
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

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
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
  Login(data) {
    return post('/account/login', data)
  },

  Logout() {
    return get('/account/logout')
  },

  getComplaint(pageNo, limit, params) {
    return get('/estate/complaint/list/'+pageNo+'/'+limit, params);
  },

  getAlarmInfo(){
    return get('/device/alarmInfo/list')
  },

  getStatistics(){
    return get('/community/statistics/homepage')
  },

  dealComplaint(id, data){
    return get('/estate/complaint/'+id+'/updateStatus/'+data)
  },

  // 公告管理
  getAnnounce(pageNo, limit, params){
    return get('/community/announcement/list/' + pageNo + '/' + limit, params);
  },
  getDeviceDetail(){
    return get('/community/device/detail/');
  },
  createAnnounce(data){
    return post('/community/announcement/add', data);
  },
  deleteAnnounce(id){
    return post('/community/announcement/'+id+'/delete')
  },
  editAnnounce(id){
    return post('/community/announcement/'+id+'/edit')
  },
  editAnnounceSave(data){
    return post('/community/announcement/editSave', data)
  }

}
