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
        <el-form :inline="true"
                 class="demo-form-inline">
          <el-form-item label="真实姓名">
            <el-input v-model="listQuery.trueName"
                      placeholder="真实姓名"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true"
                 class="demo-form-inline">
          <el-form-item label="交易账号">
            <el-input v-model="listQuery.account"
                      placeholder="交易账号"></el-input>
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
          label="交易账号"
          width='120'>
        </el-table-column>

        <el-table-column
          prop='name'
          label="昵称"
          width='160'>
        </el-table-column>

        <el-table-column
          prop='trueName'
          label="真实姓名"
          width='120'>
        </el-table-column>
        <el-table-column
          prop='amount'
          label="充值金额($)"
          width='120'>
        </el-table-column>

        <el-table-column
          label="充值方式"
          width='100'>
          <template slot-scope="scope">
            {{rechargeWay[scope.row.type] || scope.row.type}}
          </template>
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
            {{rechargeStatus[scope.row.status] || scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column
          prop='remark'
          label="备注">
        </el-table-column>

        <el-table-column
          min-width='240'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       v-if='scope.row.status == "wait"'
                       @click='openResetPwdDialog(scope.row)'>
              充值确认
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

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <el-input
        placeholder="备注"
        v-model="remark"
        clearable>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closePasswordDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmPasswordDialog">确 定</el-button>
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
          trueName: '',
          account: '',
        },

        formLabelWidth: '80px',
        rechargeStatus: {
          wait: '待确认',
          processing: '处理中',
          success: '成功',
          fail: '失败',
        },

        rechargeWay: {
          alipay: '支付宝',
          bank_card: '银联',
        },

        dialogVisible: false,
        currentMemberId: '',
        currentLogId: '',
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

      openCancelDialog(row) {
        this.cancelVisible = true
        this.cancelMemberId = row.memberId
        this.cancelId = row.id
      },
      confirmCancelDialog() {
        AXIOS.post('/backend/recharge/fail', {
          memberId: this.cancelMemberId,
          logId: this.cancelId,
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

      openResetPwdDialog(row) {
        this.dialogVisible = true
        this.currentMemberId = row.memberId
        this.currentLogId = row.id
      },

      confirmPasswordDialog() {
        AXIOS.post('/backend/recharge/confirm', {
          memberId: this.currentMemberId,
          logId: this.currentLogId,
          remark: this.remark
        }).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.closePasswordDialog()
          this.getList()
        })
      },

      closePasswordDialog() {
        this.dialogVisible = false
        this.currentMemberId = ''
        this.currentLogId = ''
        this.remark = ''
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
        AXIOS.post('/backend/recharge/index', self.listQuery).then(res => {
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
