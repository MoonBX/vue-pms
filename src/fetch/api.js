/**
 * Created by zhongyuqiang on 2017/10/9.
 */
import axios from 'axios';

axios.defaults.baseURL = 'http://114.55.143.170:8082';
// axios.defaults.baseURL = 'http://192.168.23.241:8082';

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
        if(response.data.code == '401'){
          // bus.$emit('please_login', response.data.message);
          window.location.href = '/#/login'
          localStorage.removeItem('vueToken');
        }else{
          resolve(response.data);
        }
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
        if(response.data.code == '401'){
          // bus.$emit('please_login', response.data.message);
          window.location.href = '/#/login'
          localStorage.removeItem('vueToken');
        }else{
          resolve(response.data);
        }
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
  },
  getAnnounceDetail(id){
    return post('/community/announcement/'+id+'/detail')
  },
  // 投诉
  getComplaint(pageNo, limit, params){
    return get('/estate/complaint/list/'+ pageNo + '/' + limit, params);
  },
  dealComplaint(id, data){
    return get('/estate/complaint/'+id+'/updateStatus/'+data);
  },
  getComplaintDetail(id){
    return get('/estate/complaint/'+id+'/detail');
  },
  // 设备管理
  getDevice(pageNo, limit, obj){
    return get('/device/list/' + pageNo + '/' + limit, obj)
  },
  closeDoor(id, status){
    return post('/device/'+id+'/'+status+'/change')
  },
  // 门禁管理
  getResident(pageNo, limit, obj){
    return get('/community/resident/list/' + pageNo + '/' + limit, obj)
  },
  checkExist(partitionId, unitId){
    return get('/device/isExist/'+partitionId+'/'+unitId);
  },
  createResident(obj){
    return post('/community/resident/add', obj);
  },
  editResident(obj){
    return post('/community/resident/edit', obj);
  },
  deleteResident(id){
    return post('/community/resident/'+id+'/delete');
  },
  getPublicCard(pageNo, limit, obj){
    return get('/public/card/list/' + pageNo + '/' + limit, obj);
  },
  createPublicCard(obj){
    return post('/public/card/add', obj);
  },
  detailPublicCard(id){
    return post('/public/card/'+id+'/detail');
  },
  deletePublicCard(id){
    return post('/public/card/'+id+'/delete')
  },
  // 日志管理
  getIntercom(pageNo, limit, obj){
    return get('/log/intercom/' + pageNo + '/' + limit, obj);
  },
  getAlarmInfo(pageNo, limit, obj){
    return get('/device/alarmInfo/log/list/' + pageNo + '/' + limit, obj);
  },
  getHijack(pageNo, limit, obj){
    return get('/lock/alarm/list/' + pageNo + '/' + limit, obj);
  },
  getSingleHijack(id){
    return get('/lock/alarm/query/' + id);
  },
  handleHijack(obj){
    return post('/lock/alarm/handle', obj);
  },
  // 获取位置信息
  getPartitions(){
    return get('/community/partitions');
  },
  getBlocks(partitionId){
    return get('/community/'+partitionId+'/blocks');
  },
  getUnits(blockId){
    return get('/community/' + blockId + '/units');
  },
  getRooms(unitId){
    return get('/community/' + unitId + '/rooms');
  }
}
