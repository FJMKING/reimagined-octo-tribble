// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './styles/index.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.use(ElementUI)
// 导航守卫
router.beforeEach((to, from, next) => {
  // 获取token
  var token = localStorage.getItem('itcast-token')
  if (token || to.path === '/login') {
    // 如果token存在或者跳转路径为登录页
    next()
  } else {
    next('/login')
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
