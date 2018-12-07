import axios from 'axios'
// 配置基准路劲
const baseURL = 'http://localhost:8888/api/private/v1'
axios.defaults.baseURL = baseURL
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 获取token
  var token = localStorage.getItem('itcast-token')
  if (token) {
    // 判断token是否存在，设置headers信息
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 验证用户登录
export const login = (params) => {
  return axios.post('login', params).then((results) => {
    return results.data
  })
}
// 获取用户列表
export const getUserList = (pa) => {
  return axios.get('users', {params: pa}).then((results) => {
    return results.data
  })
}
// 添加用户
export const addUsers = (params) => {
  return axios.post('users', params).then((results) => {
    return results.data
  })
}
// 编辑用户
export const editUsers = (params) => {
  return axios.put(`users/${params.id}`, params).then((results) => {
    return results.data
  })
}
// 删除用户
export const deleteUsersById = (id) => {
  return axios.delete(`users/${id}`).then((results) => {
    return results.data
  })
}
// 查询角色列表信息
export const getRole = () => {
  return axios.get(`roles`).then((results) => {
    return results.data
  })
}
// 根据id查询用户信息
export const getUsersById = (id) => {
  return axios.get(`users/${id}`).then((results) => {
    return results.data
  })
}
// 分配用户角色
export const changeRole = (params) => {
  return axios.put(`users/${params.id}/role`, {rid: params.rid}).then((results) => {
    return results.data
  })
}
// 修改用户状态
export const changeUsersState = (uid, type) => {
  return axios.put(`users/${uid}/state/${type}`).then((results) => {
    return results.data
  })
}
// 添加角色
export const addRoles = (params) => {
  return axios.post(`roles`, params).then((results) => {
    return results.data
  })
}
// 删除角色
export const deleteRoles = (id) => {
  return axios.delete(`roles/${id}`).then((results) => {
    return results.data
  })
}
// 编辑角色
export const editRoles = (params) => {
  return axios.put(`roles/${params.id}`, params).then((results) => {
    return results.data
  })
}
// 所有权限列表
export const getRights = (type) => {
  return axios.get(`rights/${type}`).then((results) => {
    return results.data
  })
}
// 角色授权
export const giveRoles = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, {rids: rids}).then((results) => {
    return results.data
  })
}
// 删除角色权限
export const deleteRolesById = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`).then((results) => {
    return results.data
  })
}
// 查询左边菜单权限列表
export const getmenus = () => {
  return axios.get(`menus`).then((results) => {
    return results.data
  })
}
// 查询商品列表
export const getGoods = (params) => {
  return axios.get(`goods`, {params: params}).then((results) => {
    return results.data
  })
}
// 获取所有商品分类数据
export const getGoodsCategories = (type) => {
  return axios.get(`categories`, {params: {type: type}}).then((results) => {
    return results.data
  })
}
// 添加商品
export const addGoods = (params) => {
  return axios.post(`goods`, params).then((results) => {
    return results.data
  })
}
// 添加分类
export const addCate = (params) => {
  return axios.post(`categories`, params).then((results) => {
    return results.data
  })
}
