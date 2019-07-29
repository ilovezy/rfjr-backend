<template>
  <div class="app-container">
    <h2>{{topTitle}}</h2>
    <el-form label-position="left"
             label-width="120px"
             :model="formData"
             :rules="rules"
             ref="ruleForm"
             status-icon
             class="demo-ruleForm">
      <cc-panel>
        <el-row :gutter="100">
          <el-col :span="12">
            <el-form-item label="用户名"
                          prop="userName">
              <el-input v-model="formData.userName"
                        :disabled='isPreview || isEdit'></el-input>
            </el-form-item>
            <el-form-item label="昵称"
                          prop="nickName">
              <el-input v-model="formData.nickName"
                        :disabled='isPreview || isEdit'></el-input>
            </el-form-item>
            <el-form-item label="密码"
                          v-if='!isPreview && !isEdit'
                          prop="password">
              <el-input v-model="formData.password"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formData.mobile"
                        :disabled='isPreview'></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.email"
                        :disabled='isPreview'></el-input>
            </el-form-item>

            <el-form-item label="角色"
                          prop="角色">
              <el-select v-model="roleIds"
                         placeholder="请选择"
                         style='width: 100%'
                         multiple
                         :disabled='isPreview || roleType.length == 0'>
                <el-option
                  v-for="item,index in roleType"
                  :key="'role' + index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-button @click="openConfirm"
                       v-if='isEdit && !isPreview'
                       v-permission='["platform:user:password:reset"]'
                       type='primary'>修改密码
            </el-button>
          </el-col>
        </el-row>
      </cc-panel>

      <el-row class='text-right'>
        <el-col :span='24'
                v-if='isPreview'>
          <el-button @click="closeCurrentTab">返回</el-button>
        </el-col>
        <el-col :span='24'
                v-else>
          <el-button @click="closeCurrentTab">取消</el-button>
          <el-button type="primary"
                     @click="submitForm">保存
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog width='500px'
               title="修改密码"
               :visible.sync="dialogFormVisible">
      <el-form label-position='left'>
        <el-form-item label="新密码"
                      label-width="100px">
          <el-input v-model="newPassword"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmChangePwd">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import AXIOS from '../../global/Fetch'

  export default {
    name: 'UserManageEdit',
    components: {},

    data() {
      const validateUserName = (rule, value, callback) => {
        if (value.length > 5) {
          callback()
        } else {
          callback(new Error('用户名长度要大于等于5位'))
        }
      }
      return {
        formData: {
          userName: '',
          nickName: '',
          mobile: '',
          password: '',
          email: '',
        },
        roleIds: [],

        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {
              validator: validateUserName, trigger: 'blur'
            }
          ],
          password: [{
            required: true, message: '请输入密码', trigger: 'blur'
          }, {
            validator: validatePassword, trigger: 'blur'
          }]
        },

        roleType: [],

        // 编辑的时候
        isEdit: false,

        dialogFormVisible: false,
        newPassword: '',

        topTitle: ''
      }
    },

    created() {
      this.id = this.$route.params && this.$route.params.id
      this.isPreview = this.$route.query && !!this.$route.query.isPreview
      this.getRoleOptions()

      if (this.id && this.id != 'add') {
        this.getUserInfo()
        this.topTitle = '编辑'
        this.isEdit = true
      }

      if (this.isPreview) {
        this.topTitle = '查看'
      }
      if (this.id == 'add') {
        this.topTitle = '新增'
      }
    },

    methods: {
      openConfirm() {
        this.newPassword = ''
        this.dialogFormVisible = true
      },
      confirmChangePwd() {
        if (isValidPassword(this.newPassword)) {
          AXIOS.post('/a/platform/user/password/reset', {
            id: this.id,
            newPassword: this.newPassword
          }).then(res => {
            this.$message.success('密码修改成功')
            this.dialogFormVisible = false
          })
        } else {
          this.$message.error('请输入正确的密码，6-16位密码必须字母+数字')
          return false
        }
      },

      getUserInfo() {
        const self = this
        const id = this.id
        AXIOS.post('/a/platform/user/view', {
          id
        }).then(res => {
          self.formData = res.platformUser || {}
          self.roleIds = res.roleIds || []
          self.getRoleOptions()
        })
      },

      getRoleOptions() {
        AXIOS.post('/a/role/platform/options', {
          target: 'platform'
        }).then(res => {
          this.roleType = res
        })
      },

      validForm() {
        let flag = true

        if (!isLongArr(this.roleIds)) {
          this.$message.error('请选择角色')
          flag = false
        }

        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })

        return flag
      },

      submitForm: _.debounce(function (formName) {
        const self = this
        if (this.validForm()) {
          let successTip = '新增成功'
          let apiUrl = '/a/platform/user/create'
          if (this.id && this.id != 'add') {
            apiUrl = '/a/platform/user/edit'
            successTip = '修改成功'
          }

          let param = {
            platformUser: this.formData,
            roleIds: this.roleIds
          }

          AXIOS.post(apiUrl, param).then(res => {
            self.$message.success(successTip)
            self.closeCurrentTab()
            self.$router.push('/setting/UserManage')
          })
        }
      }, 1000, true)
    }
  }
</script>

<style lang='scss'>
</style>
