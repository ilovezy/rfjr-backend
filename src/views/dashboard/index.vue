<template>
  <div class="app-container">
    <div class='main-table-wrap'>
      <h1>welcome to 日发金融系统</h1>

      <div class='data-container'
           v-loading='listLoading'>
        <div class='spe-item'>
          <div class='text'>今日待确认忘记密码工单</div>
          <div class='number'>
            <count-to :start-val="0"
                      :end-val="waitForgetPasswordNum"
                      :duration="duration"
                      class="card-panel-num color-orange"/>
          </div>
        </div>
        <div class='spe-item'>
          <div class='text'>今日注册</div>
          <div class='number'>
            <count-to :start-val="0"
                      :end-val="registerNum"
                      :duration="duration"
                      class="card-panel-num"/>
          </div>
        </div>
      </div>
      <div class='data-container'
           v-loading='listLoading'>
        <div class='spe-item'>
          <div class='text'>今日待确认入金单数</div>
          <div class='number'>
            <count-to :start-val="0"
                      :end-val="waitRechargeNum"
                      :duration="duration"
                      class="card-panel-num color-orange"/>
          </div>
        </div>
        <div class='spe-item'>
          <div class='text'>今日确认入金金额</div>
          <div class='number'>
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="successRechargeAmount"
                      :duration="duration"
                      prefix='$ '
                      class="card-panel-num"/>
          </div>
        </div>
      </div>
      <div class='data-container'
           v-loading='listLoading'>
        <div class='spe-item'>
          <div class='text'>今日待确认出金单数</div>
          <div class='number'>
            <count-to :start-val="0"
                      :end-val="waitWithdrawNum"
                      :duration="duration"
                      class="card-panel-num color-orange"/>
          </div>
        </div>
        <div class='spe-item'>
          <div class='text'>今日确认出金金额</div>
          <div class='number'>
            <count-to :start-val="0"
                      :decimals='2'
                      :end-val="successWithdrawAmount"
                      :duration="duration"
                      prefix='$ '
                      class="card-panel-num"/>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import CountTo from 'vue-count-to'

  export default {
    name: 'dashboard',
    components: {
      CountTo
    },
    data() {
      return {
        duration: 2000,
        listLoading: false,
        registerNum: 0,
        successRechargeAmount: 0,
        successWithdrawAmount: 0,
        waitForgetPasswordNum: 0,
        waitRechargeNum: 0,
        waitWithdrawNum: 0,
      }
    },
    created() {
      this.getDetail()
    },
    computed: {
      isDev() {
        return window.CurrentEnv == 'development'
      }
    },
    methods: {
      getDetail() {
        const self = this
        self.listLoading = true
        AXIOS.post('/backend/index/count', self.listQuery).then(res => {
          let data = res || {}
          this.registerNum = data.registerNum || 0
          this.successRechargeAmount = data.successRechargeAmount || 0
          this.successWithdrawAmount = data.successWithdrawAmount || 0
          this.waitForgetPasswordNum = data.waitForgetPasswordNum || 0
          this.waitRechargeNum = data.waitRechargeNum || 0
          this.waitWithdrawNum = data.waitWithdrawNum || 0
          self.listLoading = false
        }).catch((res) => {
          self.listLoading = false
        })
      },
    }
  }
</script>

<style lang="scss"
       scoped>
  h1 {
    text-align: center;
    font-size: 40px;
    margin-top: 30px;
    color: #000;
  }

  .data-container {
    width: 80%;
    margin: 0 auto;
    margin-top: 30px;
    min-height: 150px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .spe-item {
      width: 300px;
      text-align: center;
      .text {
        font-size: 20px;
        margin-bottom: 30px;
      }
      .card-panel-num {
        font-size: 30px;
        color: dodgerblue;

        &.color-orange {
          color: orangered;
        }
      }
    }
  }
</style>
