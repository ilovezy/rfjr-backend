<template>
  <div class="app-container">
    <div class='search-bar'>
      <div class='title-bar'>
        <div class='title'>检索条件</div>
        <div class='btn-wrap'>
          <el-button type="primary"
                     @click='doSearch'>查询
          </el-button>
          <el-button @click='resetQuery'>重置</el-button>
        </div>
      </div>
      <div class='search-control'>
        <el-form :inline="true"
                 class="demo-form-inline">
          <el-form-item label="昵称">
            <el-input v-model="listQuery.name"
                      placeholder="昵称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>


    <div class='main-table-wrap'>
      <el-table
        :data="list"
        tooltip-effect="dark"
        style="width: 100%;"
        max-height='600'
        v-loading="listLoading">
        <el-table-column
          prop='account'
          label="期货账户"
          width='120'>
        </el-table-column>

        <el-table-column
          prop='name'
          label="昵称"
          width='120'>
        </el-table-column>

        <el-table-column
          prop='trueName'
          label="真实姓名"
          width='120'>
        </el-table-column>

        <el-table-column
          prop='mobile'
          label="手机号码"
          width='120'>
        </el-table-column>
        <el-table-column
          prop='identityNo'
          label="身份证号码"
          width='200'>
        </el-table-column>

        <el-table-column
          prop='createAt'
          label="创建时间"
          width='180'>
        </el-table-column>

        <el-table-column
          label="状态"
          width='180'>
          <template slot-scope="scope">
            {{sysUserStatus[scope.row.status] || scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column
          prop='remark'
          label="备注"
          width='180'>
        </el-table-column>

        <el-table-column
          min-width='220'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       v-if='scope.row.status == "wait"'
                       @click='openResetPwdDialog(scope.row)'>
              重置密码
            </el-button>

            <el-button size="mini"
                       type='success'
                       v-if='scope.row.status == "wait"'
                       @click='openConfirmDialog(scope.row)'>
              确认
            </el-button>

            <el-button size="mini"
                       type='warning'
                       v-if='scope.row.status == "wait"'
                       @click='openCancelDialog(scope.row)'>
              确认不通过
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background
                       v-if='showPagination'
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="listQuery.page + 1"
                       :page-sizes="[10,20,30, 50]"
                       :page-size="listQuery.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="passwordDialogVisible"
      width="30%">
      <el-input
        placeholder="请输入新密码"
        v-model="newPwd"
        clearable>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closePasswordDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmPasswordDialog">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="确认通过"
      :visible.sync="confirmVisible"
      width="30%">
      <el-input
        placeholder="备注"
        v-model="remark"
        clearable>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeConfirmDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="确认不通过"
      :visible.sync="cancelVisible"
      width="30%">
      <el-input
        placeholder="备注"
        v-model="cancelRemark"
        clearable>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeCancelDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmCancelDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showPagination: true,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          size: 10,
          name: '',
        },

        formLabelWidth: '80px',
        sysUserStatus: {
          wait: '待确认',
          processing: '处理中',
          success: '确认成功',
          fail: '不通过',
        },

        passwordDialogVisible: false,
        currentPwdId: '',
        newPwd: '',

        confirmVisible: false,
        confirmId: '',
        remark: '',

        cancelVisible: false,
        cancelMemberId: false,
        cancelId: false,
        cancelRemark: '',
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,

      openResetPwdDialog(row) {
        this.passwordDialogVisible = true
        this.currentPwdId = row.memberId
      },

      confirmPasswordDialog() {
        if (isValidPassword(this.newPwd)) {
          AXIOS.post('/backend/member/resetPassword', {
            memberId: this.currentPwdId,
            newPassword: this.newPwd
          }).then(res => {
            this.$message({
              type: 'success',
              message: '密码修改成功!'
            })
            this.closePasswordDialog()
            this.getList()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '密码需在6-16位之间!'
          })
        }
      },

      closePasswordDialog() {
        this.passwordDialogVisible = false
        this.currentPwdId = ''
        this.newPwd = ''
      },

      openConfirmDialog(row) {
        this.confirmVisible = true
        this.confirmId = row.id
      },

      confirmDialog() {
        AXIOS.post('/backend/forgetPwd/confirm', {
          id: this.confirmId,
          remark: this.remark
        }).then(res => {
          this.$message({
            type: 'success',
            message: '确认成功!'
          })
          this.closeConfirmDialog()
          this.getList()
        })
      },

      closeConfirmDialog() {
        this.confirmVisible = false
        this.confirmId = false
        this.remark = ''
      },

      openCancelDialog(row) {
        this.cancelVisible = true
        this.cancelMemberId = row.memberId
        this.cancelId = row.id
      },
      confirmCancelDialog() {
        AXIOS.post('/backend/forgetPwd/fail', {
          memberId: this.cancelMemberId,
          id: this.cancelId,
          remark: this.cancelRemark
        }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.closeCancelDialog()
          this.getList()
        })
      },
      closeCancelDialog() {
        this.cancelVisible = false
        this.cancelMemberId = ''
        this.cancelId = ''
        this.cancelRemark = ''
      },
      doSearch() {
        this.showPagination = false
        setTimeout(() => {
          this.showPagination = true
        }, 10)
        this.listQuery.page = 0
        this.getList()
      },

      resetQuery() {
        this.showPagination = false
        setTimeout(() => {
          this.showPagination = true
        }, 10)
        this.listQuery = {
          page: 0,
          size: 10,
        }
        this.getList()
      },

      getList() {
        const self = this
        self.listLoading = true
        AXIOS.post('/backend/forgetPwd/index', self.listQuery).then(res => {
          self.list = res.content || []
          self.total = res.totalElements || 0
          self.listLoading = false
        }).catch((res) => {
          self.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },

      handleCurrentChange(val) {
        this.listQuery.page = val - 1
        this.getList()
      },
    }
  }
</script>

<style lang="scss"
       scoped>

</style>
