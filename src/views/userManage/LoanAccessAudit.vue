<!--TODO-->
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
          <el-form-item label="手机号">
            <el-input v-model.number="listQuery.mobile"
                      placeholder="手机号"></el-input>
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="listQuery.trueName"
                      placeholder="姓名"></el-input>
          </el-form-item>

          <el-form-item label="注册时间">
            <el-date-picker
              v-model='dateOrigin'
              @change='changeDate'
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="审核状态">
            <el-select v-model="listQuery.enteredStatus"
                       placeholder="请选择状态">
              <el-option
                v-for="item,index in enterStatusMap"
                :key="'enterStatusMap' + index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          prop="mobile"
          label="手机号"
          width='140'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="trueName"
          label="姓名"
          width='140'>
        </el-table-column>

        <el-table-column
          prop="identityNumber"
          label="身份证号"
          width='200'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="registerTime"
          label="注册时间"
          width='180'>
        </el-table-column>

        <el-table-column
          prop='enterApplyTime'
          label="提交审核时间"
          width='180'>
        </el-table-column>

        <el-table-column
          label="是否首次审核"
          width='120'
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.enterApplyFlag ? '是' : '否'}}
          </template>
        </el-table-column>

        <el-table-column
          label="审核状态"
          width='140'
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{enterStatus[scope.row.enterStatus] || scope.row.enterStatus}}
          </template>
        </el-table-column>

        <el-table-column
          prop='borrowLimit'
          label="基础借款额度"
          width='180'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          min-width='320'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click='handleEdit(scope.$index, scope.row, true)'>
              认证信息 TODO
            </el-button>

            <el-button type='success'
                       v-if='scope.row.enterStatus == "processing"'
                       @click='openAuditModal(scope.$index, scope.row)'
                       size="mini">
              准入审核
            </el-button>

            <el-popover
              placement="left"
              width="500"
              v-if='scope.row.enterStatus!="processing"'
              trigger="click">
              <el-table :data="gridData"
                        v-loading='loadingRecord'>
                <el-table-column width="180"
                                 property="createAt"
                                 label="审核时间">
                </el-table-column>
                <el-table-column width="80"
                                 property="auditFlag"
                                 label="审核结果">
                  <template slot-scope="scope">
                    {{scope.row.auditFlag ? '通过' : '不通过' }}
                  </template>
                </el-table-column>
                <el-table-column width="200"
                                 property="advice"
                                 label="备注">
                </el-table-column>
              </el-table>
              <el-button
                size="mini"
                type='primary'
                slot="reference"
                @click="handleShowCheckRecord(scope.$index, scope.row)">
                查看历史审核
              </el-button>
            </el-popover>
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

    <el-dialog title="准入审核"
               width='400px'
               :visible.sync="auditModalShow">
      <el-form label-position='left'>
        <el-form-item label="审核结果"
                      :label-width="formLabelWidth">
          <el-radio v-model="auditFlag"
                    :label="true">审核通过
          </el-radio>
          <el-radio v-model="auditFlag"
                    :label="false">审核不通过
          </el-radio>
        </el-form-item>

        <hr style='margin-bottom: 30px;'>

        <div v-if='auditFlag'>
          <p>请评估基础借款额度(500-1000元之间)</p>
          <el-input-number v-model="borrowLimit"
                           controls-position="right"
                           style='width: 100%;'
                           :min="500"
                           :max="1000"></el-input-number>
        </div>
        <div v-else>
          <p>请填写不通过原因</p>
          <el-input v-model="advice"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 10}"
                    :maxLength='100'
                    placeholder='100字之内'></el-input>
        </div>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeAuditDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmAuditDialog">确 定
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
          trueName: '',
          registerTimeStart: '',
          registerTimeEnd: '',
          mobile: '',
          enteredStatus: ''
        },

        dateOrigin: '',

        formLabelWidth: '80px',
        auditModalShow: false,

        advice: '',
        auditFlag: true,
        borrowLimit: '',
        memberId: '',

        enterStatus: {
          wait: '待处理',
          processing: '待审核',
          success: '审核通过',
          fail: '审核未通过'
        },
        enterStatusMap: [
          // { value: 'wait', label: '待处理',},
          {value: 'processing', label: '待审核',},
          {value: 'success', label: '审核通过',},
          {value: 'fail', label: '审核未通过',},
        ],

        gridData: [],
        loadingRecord: false
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,

      changeDate(dateArr) {
        this.listQuery.registerTimeStart = new Date(dateArr[0]).getTime()
        this.listQuery.registerTimeEnd = new Date(dateArr[1]).getTime()
      },

      openAuditModal(index, row) {
        this.memberId = row.id
        this.auditModalShow = true
      },

      closeAuditDialog() {
        this.auditModalShow = false
        this.advice = ''
        this.auditFlag = true
        this.borrowLimit = 0
        this.memberId = ''
        this.getList()
      },

      confirmAuditDialog() {
        const self = this
        let param = {
          memberId: self.memberId,
          auditFlag: self.auditFlag
        }

        if (self.auditFlag) {
          param.borrowLimit = self.borrowLimit
        } else {
          param.borrowLimit = 0
          if (self.advice) {
            param.advice = self.advice
          } else {
            this.$message({
              type: 'warning',
              message: '请填写不通过原因!'
            })
            return
          }
        }
        AXIOS.post('/auth/platformMember/memberEnteredAudit', param).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.closeAuditDialog()
        })
      },

      resetQuery() {
        this.showPagination = false
        setTimeout(() => {
          this.showPagination = true
        }, 10)
        this.dateOrigin = ''
        this.listQuery = {
          page: 0,
          size: 10,
        }
        this.getList()
      },

      doSearch() {
        this.showPagination = false
        setTimeout(() => {
          this.showPagination = true
        }, 10)
        this.listQuery.page = 0
        this.getList()
      },

      getList() {
        const self = this
        self.listLoading = true
        AXIOS.post('/auth/platformMember/memberEnteredAuditPageIndex', self.listQuery).then(res => {
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

      handleEdit() {

      },

      handleShowCheckRecord: function(index, row) {
        this.gridData = []
        this.loadingRecord = true
        AXIOS.post('/auth/platformMember/memberEnteredAuditList', {
          id: row.id
        }).then(res => {
          if (isLongArr(res)) {
            this.gridData = res
          }
          this.loadingRecord = false
        }).catch(res => {
          this.loadingRecord = false
        })
      }
    }
  }
</script>

<style lang="scss"
       scoped>

</style>


