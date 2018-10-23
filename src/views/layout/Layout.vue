<template>
  <div class="app-wrapper"
       :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened"
         class="drawer-bg"
         @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <div class='main-container-header-fix'>
        <navbar></navbar>
        <tags-view></tags-view>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain, TagsView } from './components'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView
    },
    mixins: [ResizeMixin],
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      device() {
        return this.$store.state.app.device
      },
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          openSidebar: this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    created() {
      // this.getActionPermission() //TODO 按钮权限
    },
    methods: {
      getActionPermission() {
        AXIOS.post('/auth/menu/userAllActionMenus').then(res => {
          // this.$store.dispatch('addActionPermission', res)
          USER.setPermissions(res)
        })
      },
      handleClickOutside() {
        this.$store.dispatch('closeSideBar', { withoutAnimation: false })
      }
    }
  }
</script>

<style rel="stylesheet/scss"
       lang="scss"
       scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .main-container-header-fix {
    /*position: fixed;*/
    /*top: 0;*/
    /*width: 100%;*/
    /*z-index: 5;*/
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
