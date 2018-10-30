<template>
  <div class="app-container">
    <!--<div class='search-bar'>-->
    <!--<div class='title-bar'>-->
    <!--<div class='title'>检索条件</div>-->
    <!--<div class='btn-wrap'>-->
    <!--<el-button type="primary"-->
    <!--@click='doSearch'>查询-->
    <!--</el-button>-->
    <!--<el-button @click='resetQuery'>重置</el-button>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class='search-control'>-->
    <!--<el-form :inline="true"-->
    <!--class="demo-form-inline">-->
    <!--<el-form-item label="真实姓名">-->
    <!--<el-input v-model="listQuery.trueName"-->
    <!--placeholder="真实姓名"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--</div>-->
    <!--</div>-->

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
          width='160'>
        </el-table-column>

        <el-table-column
          prop='name'
          label="昵称"
          width='160'>
        </el-table-column>

        <el-table-column
          prop='trueName'
          label="真实姓名"
          width='160'>
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
          min-width='500'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size='mini'
                       type='primary'
                       v-permission='["platform:account:user:freeze"]'
                       @click="handleToggleFreeze(scope.$index, scope.row, scope.row.status == 'freeze')"
                       v-if='scope.row.status != "freeze" && scope.row.status != "cancel"'>冻结
            </el-button>
            <el-button size='mini'
                       type='warning'
                       v-permission='["platform:account:user:unfreeze"]'
                       @click="handleToggleFreeze(scope.$index, scope.row, scope.row.status == 'freeze')"
                       v-if='scope.row.status == "freeze" && scope.row.status != "cancel"'>解冻
            </el-button>

            <el-button
              v-permission='["platform:account:user:cancel"]'
              v-if='scope.row.status != "cancel"'
              size="mini"
              type="danger"
              @click="handleCancel(scope.$index, scope.row)">注销
            </el-button>

            <el-button size="mini"
                       type='success'
                       v-if='scope.row.status != "cancel"'
                       @click='openSetAccountDialog(scope.row)'>
              手动开户
            </el-button>

            <el-button size="mini"
                       v-if='scope.row.status != "cancel"'
                       @click='openSetRuleDialog(scope.row)'>
              添加开户规则
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
      title="提示"
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
      title="提示"
      :visible.sync="accountDialogVisible"
      width="30%">
      <el-input
        placeholder="请输入期货账户"
        v-model="newAccount"
        clearable>
      </el-input>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeAccountDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmAccountDialog">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加开户规则"
      :visible.sync="ruleDialogVisible"
      width="30%">
      <el-form ref="form"
               label-width="120px">
        <el-form-item label="开始号段">
          <el-input-number v-model="accountStart"
                           controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="结束号段">
          <el-input-number v-model="accountEnd"
                           controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeRuleDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmRuleDialog">确 定</el-button>
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
          trueName: '',
        },

        formLabelWidth: '80px',
        sysUserStatus: {
          freeze: '冻结',
          normal: '正常',
          cancel: '注销'
        },

        accountDialogVisible: false,
        currentAccountId: '',
        newAccount: '',

        ruleDialogVisible: false,
        currentRuleId: '',
        accountStart: '',
        accountEnd: ''
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,
      openSetRuleDialog(row) {
        this.ruleDialogVisible = true
        this.currentRuleId = row.id
      },

      confirmRuleDialog() {
        if (this.accountStart && this.accountEnd) {
          if (this.accountEnd > this.accountStart) {

            AXIOS.post('/backend/inviter/config/account/save', {
              memberId: this.currentRuleId,
              accountStart: this.accountStart,
              accountEnd: this.accountEnd
            }).then(res => {
              this.$message({
                type: 'success',
                message: '开户规则设置成功!'
              })
              this.closeRuleDialog()
              this.getList()
            })
          } else {
            this.$message({
              type: 'warning',
              message: '结束号段必须大于开始号段'
            })
          }

        } else {
          this.$message({
            type: 'warning',
            message: '请设置开始，结束号段'
          })
        }
      },

      closeRuleDialog() {
        this.ruleDialogVisible = false
        this.currentRuleId = ''
        this.accountStart = ''
        this.accountEnd = ''
      },

      openSetAccountDialog(row) {
        this.accountDialogVisible = true
        this.currentAccountId = row.id
      },

      confirmAccountDialog() {
        if (this.newAccount) {
          AXIOS.post('/backend/member/setAccount', {
            memberId: this.currentAccountId,
            account: this.newAccount
          }).then(res => {
            this.$message({
              type: 'success',
              message: '期货账户修改成功!'
            })
            this.closeAccountDialog()
            this.getList()
          })
        } else {
          this.$message({
            type: 'warning',
            message: '密码需在6-16位之间!'
          })
        }
      },

      closeAccountDialog() {
        this.accountDialogVisible = false
        this.currentAccountId = ''
        this.newAccount = ''
      },

      handleCancel(index, row) {
        this.$confirm('确定注销？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/backend/member/cancel', {
            memberId: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '注销成功!'
            })
            this.getList()
          })
        })
      },

      handleToggleFreeze(index, row, freeze) {
        const tip = freeze ? '解冻' : '冻结'
        const url = freeze ? '/backend/member/unfreeze' : '/backend/member/freeze'
        this.$confirm('确定' + tip + '该用户吗？', {
          type: 'warning'
        }).then(() => {
          AXIOS.post(url, {
            memberId: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: tip + '成功!'
            })
            this.getList()
          })
        })
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
        AXIOS.post('/backend/member/index', self.listQuery).then(res => {
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
