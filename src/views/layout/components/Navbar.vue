<template>
  <el-menu class="navbar"
           mode="horizontal">
    <div class='left'>
      <hamburger class="hamburger-container"
                 :toggleClick="toggleSideBar"
                 :isActive="sidebar.opened"></hamburger>

      <breadcrumb class="breadcrumb-container"></breadcrumb>
    </div>
    <div class="right-menu">
      <el-tooltip effect="dark"
                  content="查看文档"
                  v-if='isTestEnv'
                  placement="bottom">
        <router-link to='/documentation'
                     class='document-icon'>文档
        </router-link>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item"
                   trigger="hover">
        <div class="login-name">
          {{loginName}}
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="doLogout"
                  style="display:block;">
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import USER from '../../../global/USER'

  export default {
    components: {
      Breadcrumb,
      Hamburger
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ])
    },
    data() {
      return {
        loginName: USER.getLoginName() || '',
        isTestEnv: window.CurrentEnv == 'development'
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      doLogout() {
        USER.logout()
        this.$store.dispatch('delAllViews')
        this.$store.dispatch('delActionPermission')
        this.$router.push('/login')
      }
    }
  }
</script>

<style rel="stylesheet/scss"
       lang="scss"
       scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:before ,&:after{
      display: none;
    }
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      display: flex;
      align-items: center;
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .document-icon {
        margin-right: 30px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .login-name {
          cursor: pointer;
        }
      }
    }
  }
</style>
