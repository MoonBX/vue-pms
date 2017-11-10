import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.22.139:8088';

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        console.log(response)
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
  setCredit(data) {
    return post('/account/login', data)
  }
}
