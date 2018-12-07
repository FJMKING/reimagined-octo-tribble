<template>
  <div class="home">
    <el-container>
      <el-aside width="auto">
        <router-link to="home"><div class="logo"></div></router-link>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo el-menu-admin"
          @open="handleOpen"
          @close="handleClose"
          background-color="#A1E0F8"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
          :collapse="collapse"
        >
          <el-submenu :index="itemmenu.id+''" v-for="itemmenu in menuList" :key="itemmenu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{itemmenu.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/'+submenu.path" v-for="submenu in itemmenu.children" :key="submenu.id">
                 <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{submenu.authName}}</span>
            </template>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <a href="javascript:;" class="myicon myicon-menu toggle-btn" @click="collapse=!collapse"></a>
          <div class="system-title">电商后台管理系统</div>
          <div>
            <span class="welcome">你好：***</span>
            <span><el-button type="text" @click="logout">退出</el-button></span>
          </div>
        </el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getmenus } from '@/api'
export default {
  data () {
    return {
      collapse: false,
      menuList: []
    }
  },
  mounted () {
    getmenus().then(res => {
      // console.log(res)
      this.menuList = res.data
    })
  },
  methods: {
    // 退出功能
    logout () {
    // 清楚存储的token值
      localStorage.removeItem('itcast-token')
      // 跳转到登陆
      this.$router.push({name: 'Login'})
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color:rgb(161, 224, 248);
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(161, 224, 248);
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color:#A1E0F8;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome, {
    color: white;
  }
}
</style>
