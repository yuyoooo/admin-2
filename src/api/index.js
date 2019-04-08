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
// 更改用户状态
export const changeUserState = params => {
  return axios.put(`users/${params.uid}/state/${params.type}`).then(res => res.data)
}
// 添加用户
export const addUser = params => {
  return axios.post('users', params).then(res => res.data)
}
// 根据id获取用户信息
export const editUserById = params => {
  return axios.get(`users/${params}`).then(res => res.data)
}
// 编辑用户信息
export const editUser = params => {
  return axios.put(`users/${params.id}`, params).then(res => res.data)
}
// 删除用户
export const deleteUserData = params => {
  return axios.delete(`users/${params}`).then(res => res.data)
}
// 获取角色列表
export const getRoleList = params => {
  return axios.get('roles').then(res => res.data)
}
// 分配角色
export const grandUserRole = params => {
  return axios.put(`users/${params.id}/role`, {id: params.id, rid: params.rid}).then(res => res.data)
}
