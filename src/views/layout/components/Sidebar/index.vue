<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <!--<div style='background: #025080; text-align: center; padding: 40px 0;' v-if='!isCollapse'>-->
      <!--<img src='../img/nav-logo.png'-->
           <!--style='width: 150px;'-->
           <!--alt=''>-->
    <!--</div>-->
    <el-menu
      v-loading="loading"
      element-loading-background="#025080"
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#025080"
      text-color="#bfcbd9"
      active-text-color="#1989FA">
      <sidebar-item v-for="route in routers"
                    :key="route.name"
                    :item="route"
                    :base-path="route.path"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import { constantRouterMap, asyncRouterMap } from '@/router'
  import AXIOS from '../../../../global/Fetch'
  // TODO router 由后台生成

  export default {
    components: { SidebarItem },
    data() {
      return {
        routers: [],
        loading: false
      }
    },
    created() {
      this.getSidebar()
      // this.loadSidebar()
    },
    methods: {
      getSidebar() {
        const self = this
        self.loading = true
        setTimeout(() => {
          self.routers = constantRouterMap.concat(asyncRouterMap)
          self.loading = false
        }, 1000)
      },
      loadSidebar() {
        const self = this
        self.loading = true
        AXIOS.post('/auth/menu/userMenuBarTree').then(res => {
          self.routers = res || []
          self.loading = false
        }).catch(res => {
          self.loading = false
        })
      }
    },
    computed: {
      ...mapGetters([
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      }
    }
  }
</script>
