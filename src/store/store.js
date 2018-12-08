import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  // 存储数据对象
  username: ''
}
const mutations = {
  // 操作state中数据的函数集合
  setUserName (state, name) {
    state.username = name
    localStorage.setItem('temp', name)
  }
  // getUserName (state) {
  //   return state.username
  // }
}
const actions = {
  // 触发mutations中函数的处理函数
  setUserNameAction: ({commit}, name) => {
    commit('setUserName', name)
  }
  // getUserNameAction: ({commit}) => {
  //   commit('getUserName')
  // }
}
const getters = {
  getUserName: (state) => {
    return localStorage.getItem('temp')
  }
}
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
