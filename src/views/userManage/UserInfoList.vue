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
          min-width='210'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       type='primary'
                       v-if='scope.row.status != "cancel"'
                       @click='openInfoDialog(scope.row)'>
              详情
            </el-button>
            <el-button size="mini"
                       type='info'
                       v-if='scope.row.status != "cancel" && scope.row.inviterFlag'
                       @click='openInviteListDialog(scope.row.id)'>
              邀请人列表
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
      title="邀请人列表"
      :visible.sync="inviteVisible"
      width="900px">
      <div class='el-alert--info' v-if='inviteList.length > 0' style='padding: 15px;'>
        共邀请 <span style='color: orangered'>{{inviteList.length}}</span>人
      </div>
      <el-table
        :data="inviteList"
        tooltip-effect="dark"
        style="width: 100%;"
        max-height='500'>
        <el-table-column
          prop='account'
          label="交易账号"
          width='120'>
        </el-table-column>

        <el-table-column
          prop='name'
          label="昵称"
          width='140'>
        </el-table-column>

        <el-table-column
          prop='trueName'
          label="真实姓名"
          width='120'>
        </el-table-column>
        <el-table-column
          prop='identityNo'
          label="身份证号码"
          width='200'>
        </el-table-column>

        <el-table-column
          prop='createAt'
          label="创建时间">
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="accountDialogVisible"
      width="30%">
      <el-input
        placeholder="请输入交易账号"
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

    <el-dialog
      title="个人信息"
      :visible.sync="infoVisible"
      width="40%">
      <div>昵称: {{info.name}}</div>
      <div>总金额: $ {{info.balance}}</div>
      <div>可用金额: $ {{info.availableBalance}}</div>

      <div style='padding: 15px;background: #f7f7f7; margin-top: 15px;'>
        <div v-if='info.realNameFlag'
             class='spe'>
          <svg-icon icon-class="yes"/>
          <div>
            <div>真实姓名: {{info.trueName}}</div>
            <div>身份证号: {{info.identityNo}}</div>
          </div>
        </div>
        <div v-else>
          未实名认证
        </div>
      </div>

      <div style='padding: 15px;background: #f7f7f7; margin-top: 15px;'>
        <div v-if='info.openAccountFlag'
             class='spe'>
          <svg-icon icon-class="yes"/>
          <div>交易账号: {{info.account}}</div>
        </div>
        <div v-else>
          未开通交易账号
        </div>
      </div>

      <div style='padding: 15px;background: #f7f7f7; margin-top: 15px;'>
        <div v-if='info.bindCardFlag'
             class='spe'>
          <svg-icon icon-class="yes"/>
          <div>
            <div>银行名称：{{info.cardBankName}}</div>
            <div>支行名称：{{info.cardBankBranch}}</div>
            <div>开户地址：{{info.cardAddress}}</div>
            <div>开户银行卡号：{{info.cardNo}}</div>
          </div>
        </div>
        <div v-else>未开通银行卡</div>
      </div>

      <div class='action-bar'
           style='margin-top: 30px;'>
        <el-button size='mini'
                   type='primary'
                   @click="handleToggleFreeze(currentStatus == 'freeze')"
                   v-if='currentStatus != "freeze" && currentStatus != "cancel"'>冻结
        </el-button>
        <el-button size='mini'
                   type='warning'
                   @click="handleToggleFreeze(currentStatus == 'freeze')"
                   v-if='currentStatus == "freeze" && currentStatus != "cancel"'>解冻
        </el-button>

        <el-button
          v-if='currentStatus != "cancel"'
          size="mini"
          type="danger"
          @click="handleCancel">注销
        </el-button>

        <el-button size="mini"
                   v-if='currentStatus != "cancel"'
                   @click='openSetRuleDialog()'>
          添加开户规则
        </el-button>

        <el-button size="mini"
                   type='success'
                   v-if='currentStatus != "cancel"'
                   @click='openSetAccountDialog'>
          手动开户
        </el-button>
      </div>
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
        accountEnd: '',

        infoVisible: false,
        info: {},
        currentStatus: '',
        currentInfoId: '',

        inviteList: [],
        inviteVisible: false,
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,
      openInviteListDialog(id) {
        AXIOS.post('/backend/member/inviteList', {
          memberId: id,
        }).then(res => {
          this.inviteList = isLongArr(res) ? res : []
          this.inviteVisible = true
        })
      },

      openInfoDialog(row) {
        this.currentStatus = row.status
        this.currentInfoId = row.id
        AXIOS.post('/backend/member/center', {
          memberId: row.id,
        }).then(res => {
          this.info = res || {}
          this.infoVisible = true
        })
      },

      closeInfoDialog() {
        this.currentStatus = ''
        this.currentInfoId = ''
        this.info = {}
        this.infoVisible = false
        this.getList()
      },

      openSetRuleDialog() {
        this.ruleDialogVisible = true
      },

      confirmRuleDialog() {
        if (this.accountStart && this.accountEnd) {
          if (this.accountEnd > this.accountStart) {
            AXIOS.post('/backend/inviter/config/account/save', {
              memberId: this.currentInfoId,
              accountStart: this.accountStart,
              accountEnd: this.accountEnd
            }).then(res => {
              this.$message({
                type: 'success',
                message: '开户规则设置成功!'
              })
              this.closeRuleDialog()
              this.closeInfoDialog()
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

      openSetAccountDialog() {
        this.accountDialogVisible = true
      },

      confirmAccountDialog() {
        if (this.newAccount) {
          AXIOS.post('/backend/member/setAccount', {
            memberId: this.currentInfoId,
            account: this.newAccount
          }).then(res => {
            this.$message({
              type: 'success',
              message: '交易账号修改成功!'
            })
            this.closeAccountDialog()
            this.closeInfoDialog()
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

      handleCancel() {
        this.$confirm('确定注销？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/backend/member/cancel', {
            memberId: this.currentInfoId
          }).then(res => {
            this.$message({
              type: 'success',
              message: '注销成功!'
            })
            this.closeInfoDialog()
          })
        })
      },

      handleToggleFreeze(freeze) {
        const tip = freeze ? '解冻' : '冻结'
        const url = freeze ? '/backend/member/unfreeze' : '/backend/member/freeze'
        this.$confirm('确定' + tip + '该用户吗？', {
          type: 'warning'
        }).then(() => {
          AXIOS.post(url, {
            memberId: this.currentInfoId
          }).then(res => {
            this.$message({
              type: 'success',
              message: tip + '成功!'
            })
            this.closeInfoDialog()
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
  .spe {
    display: flex;
    align-items: center;
    .svg-icon {
      color: #fff;
      background: green;
      border-radius: 50px;
      width: 50px;
      height: 50px;
      line-height: 50px;
      display: inline-block;
      margin-right: 20px;
      font-size: 20px;
      padding: 10px;
    }
  }
</style>
