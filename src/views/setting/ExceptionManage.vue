<template>
  <div class="app-container">
    <el-row :gutter='120'>
      <el-col :span='12'>
        <h2>手动异常处理兑现记录</h2>
        <p>/a/platform/exception/singleCoinWithdrawHandle </p>
        <el-form ref="form"
                 :model="formA"
                 label-width="80px">
          <el-form-item label="id">
            <el-input v-model="formA.id"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formA.remark"></el-input>
          </el-form-item>
          <el-form-item label="verifyFlag">
            <el-radio-group v-model="formA.verifyFlag">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div style='text-align: right;'>
          <el-button type='primary'
                     @click='doFormA'>确定
          </el-button>
        </div>
      </el-col>


      <el-col :span='12'>
        <h2>手动异常处理VIP购买订单</h2>
        <p>/a/platform/exception/singleVipOrderHandle</p>
        <el-form ref="form"
                 :model="formB"
                 label-width="80px">
          <el-form-item label="id">
            <el-input v-model="formB.id"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formB.remark"></el-input>
          </el-form-item>
          <el-form-item label="verifyFlag">
            <el-radio-group v-model="formB.verifyFlag">
              <el-radio :label="true">true</el-radio>
              <el-radio :label="false">false</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div style='text-align: right;'>
          <el-button type='primary'
                     @click='doFormB'>确定
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AXIOS from '../../global/Fetch'

  export default {
    data() {
      return {
        formA: {
          id: '',
          remark: '',
          verifyFlag: null
        },
        formB: {
          id: '',
          remark: '',
          verifyFlag: null
        },
      }
    },
    created() {

    },
    methods: {
      validFormA() {
        let flag = true
        const formA = this.formA || {}
        if (!formA.id) {
          this.$message.error('请填写id')
          flag = false
        }
        if (!formA.remark) {
          this.$message.error('请填写备注')
          flag = false
        }
        if (formA.verifyFlag === null) {
          this.$message.error('请填写verifyFlag')
          flag = false
        }
        return flag
      },

      doFormA() {
        const self = this
        if (self.validFormA()) {
          this.$confirm('确定执行吗？', {
            type: 'warning'
          }).then(() => {
            AXIOS.post('/a/platform/exception/singleCoinWithdrawHandle', self.formA).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              self.formA = {
                id: '',
                remark: '',
                verifyFlag: null
              }
            }).catch(() => {
            })
          })
        }

      },

      validFormB() {
        let flag = true
        const formB = this.formB || {}
        if (!formB.id) {
          this.$message.error('请填写id')
          flag = false
        }
        if (!formB.remark) {
          this.$message.error('请填写备注')
          flag = false
        }
        if (formB.verifyFlag === null) {
          this.$message.error('请填写verifyFlag')
          flag = false
        }
        return flag
      },

      doFormB() {
        const self = this
        if (self.validFormB()) {
          this.$confirm('确定执行吗？', {
            type: 'warning'
          }).then(() => {
            AXIOS.post('/a/platform/exception/singleVipOrderHandle', self.formB).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              self.formB = {
                id: '',
                remark: '',
                verifyFlag: null
              }
            }).catch(() => {
            })
          })
        }

      },
    }
  }
</script>

<style lang="scss"
       scoped>
  .spe-btn {
    margin-bottom: 15px;
  }
</style>


