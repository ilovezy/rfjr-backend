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
      <!--<el-tooltip effect="dark"-->
                  <!--content="查看文档"-->
                  <!--v-if='isTestEnv'-->
                  <!--placement="bottom">-->
        <!--<router-link to='/documentation'-->
                     <!--class='document-icon'>文档-->
        <!--</router-link>-->
      <!--</el-tooltip>-->

      <el-dropdown class="avatar-container right-menu-item"
                   trigger="hover">
        <div class="login-name">
          {{loginName}}
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="openChangePwdDialog"
                  style="display:block;">
              修改密码
            </span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="doLogout"
                  style="display:block;">
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>


    <el-dialog
      title="修改密码"
      :visible.sync="showDialog"
      width="30%">
      <el-input
        style='margin-bottom: 15px;'
        placeholder="请输入原密码"
        v-model="oldPassword"
        clearable>
      </el-input>
      <el-input
        placeholder="请输入新密码"
        v-model="newPassword"
        clearable>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>

  </el-menu>
</template>

<script>
  import {mapGetters} from 'vuex'
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
        isTestEnv: window.CurrentEnv == 'development',

        showDialog: false,
        oldPassword: '',
        newPassword: '',
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
      },

      openChangePwdDialog() {
        this.showDialog = true
      },
      closeDialog() {
        this.showDialog = false
        this.oldPassword = ''
        this.newPassword = ''
      },
      confirmDialog(){
        if (isValidPassword(this.oldPassword) && isValidPassword(this.newPassword)){
          if (this.oldPassword && this.newPassword) {
            if (this.oldPassword != this.newPassword) {
              AXIOS.post('/backend/systemUser/changeMyPassword', {
                oldPassword: this.oldPassword,
                newPassword: this.newPassword,
              }).then(res => {
                this.$message({
                  type: 'success',
                  message: '设置成功!'
                })
                this.closeDialog()
                this.getList()
              })
            } else {
              this.$message({
                type: 'warning',
                message: '新密码不能与老密码相同'
              })
            }

          } else {
            this.$message({
              type: 'warning',
              message: '请输入老密码和新密码'
            })
          }
        } else {
          this.$message({
            type: 'warning',
            message: '密码格式错误，为6-16位'
          })
        }
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
    &:before, &:after {
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
