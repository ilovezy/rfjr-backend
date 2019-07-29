<template>
  <div class="app-container">
    <h1>定时任务</h1>
    <el-row :gutter='10'>
      <el-col :span='24'>

        <el-button type='primary'
                   class='spe-btn'
                   :loading='load3'
                       v-permission='["platform:job:member:vip:check"]'
                   @click='doJob("/a/platform/job/member/vip/check", "失效到期会员的推荐关系", "load3")'>失效到期会员的推荐关系
        </el-button>   <br>
        <el-button type='primary'
                   class='spe-btn'
                   :loading='load4'
                       v-permission='["platform:job:member:vip:notice"]'
                   @click='doJob("/a/platform/job/member/vip/notice", "即将到期会员通知", "load4")'>即将到期会员通知
        </el-button>   <br>
        <el-button type='primary'
                   class='spe-btn'
                   :loading='load5'
                       v-permission='["platform:job:member:coin:rebate"]'
                   @click='doJob("/a/platform/job/member/coin/rebate", "执行返利计划", "load5")'>执行返利计划
        </el-button>   <br>
        <el-button type='primary'
                   class='spe-btn'
                   :loading='load6'
                       v-permission='["platform:job:member:vip:order:syn"]'
                   @click='doJob("/a/platform/job/member/vip/order/syn", "同步会员购买VIP订单", "load6")'>同步会员购买VIP订单
        </el-button>
        <br>
        <hr>
        <br>
        <el-button type='primary'
                   class='spe-btn'
                   :loading='load1'
                   v-permission='["platform:authority:menu:index"]'
                   @click='doJob("/a/platform/job/book/miyue", "获取蜜阅书籍", "load1")'>获取蜜阅书籍
        </el-button>
        <br>
        <el-button type='primary'
                   class='spe-btn'
                   :loading='load2'
                   v-permission='["platform:job:book:chapter:miyue"]'
                   @click='doJob("/a/platform/job/book/chapter/miyue", "更新蜜阅书籍章节", "load2")'>更新蜜阅书籍章节
        </el-button>   <br>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AXIOS from '../../global/Fetch'

  export default {
    data() {
      return {
        load1: false,
        load2: false,
        load3: false,
        load4: false,
        load5: false,
        load6: false,
      }
    },
    created() {

    },
    methods: {
      doJob(url, text, loadText) {
        const self = this
        this.$confirm('执行' + text + '？', {
          type: 'warning'
        }).then(() => {
          self[loadText] = true
          AXIOS.post(url, {}).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          }).catch(() => {
            self[loadText] = false
          })
        }).catch(() => {

        })
      }
    }
  }
</script>

<style lang="scss"
       scoped>
.spe-btn {
  margin-bottom: 15px;
}
</style>


