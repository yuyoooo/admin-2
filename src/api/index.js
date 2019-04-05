import axios from 'axios'
const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  let token = localStorage.getItem('mytoken')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 登录验证
export const checkUser = parmas => {
  return axios.post('login', parmas).then(res => res.data)
}
// 获取用户列表
export const getUserList = parmas => {
  return axios.get('users', parmas).then(res => res.data)
}
