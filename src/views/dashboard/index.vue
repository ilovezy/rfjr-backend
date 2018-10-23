<template>
  <div class="app-container">
    <h1>welcome to 日发金融系统</h1>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'dashboard',
    data() {
      return {

      }
    },
    created() {
    },
    computed: {
      isDev() {
        return window.CurrentEnv == 'development'
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  h1 {
    text-align: center;
    font-size: 40px;
    margin-top: 50px;
    color: #000;
  }
</style>
