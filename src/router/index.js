import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Users from '@/views/user/Users'
import Roles from '@/views/rights/roles'
import Right from '@/views/rights/rights'
import Goods from '@/views/goods/Goods'
import Lists from '@/views/goods/Lists'
import Add from '@/views/goods/Add'
import Categories from '@/views/goods/Categories'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [{
      path: 'users',
      name: 'Users',
      component: Users
    },
    {
      path: 'roles',
      name: 'Roles',
      component: Roles
    },
    {
      path: 'rights',
      name: 'Right',
      component: Right
    },
    {
      path: 'goods',
      name: 'Goods',
      component: Goods,
      redirect: {
        name: 'Lists'
      },
      children: [{
        path: 'lists',
        name: 'Lists',
        component: Lists
      }, {
        path: 'add',
        name: 'Add',
        component: Add
      }]
    },
    {
      path: 'categories',
      name: 'Categories',
      component: Categories
    }
    ]
  }
  ]
})
