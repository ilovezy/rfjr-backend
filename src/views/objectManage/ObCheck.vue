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
          <el-form-item label="业务类型">
            <el-input v-model="listQuery.businessTypeName"
                      placeholder="业务类型"></el-input>
          </el-form-item>
          <el-form-item label="产品类型">
            <el-input v-model="listQuery.productTypeName"
                      placeholder="产品类型"></el-input>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="listQuery.status"
                       @change='getList'
                       placeholder="请选择状态">
              <el-option
                v-for="item,index in platformObStatusTypeMap"
                :key="'target' + index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="线下申请时间">
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
          prop="merchantAssetName"
          label="资产方"
          width='200'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="businessTypeName"
          label="业务类型"
          width='200'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="productTypeName"
          label="产品类型"
          width='200'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="线下申请时间"
          width='140'
          show-overflow-tooltip>
          <template slot-scope="scope">
            <!--{{ formatDate(new Date(scope.row.offlineApplyTime).getTime(),'YYYY-MM-DD')}}-->
            {{splitDate(scope.row.offlineApplyTime)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="borrowerType"
          label="借款人类型"
          width='120'>
          <template slot-scope="scope">
            {{borrowerType[scope.row.borrowerType] || scope.row.borrowerType}}
          </template>
        </el-table-column>
        <el-table-column
          prop="borrowerName"
          width='200'
          label="借款人/借款企业名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="legalName"
          label="法人姓名"
          width='200'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="formatBorrowerMobile"
          width='200'
          label="借款人/法人手机号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="借款金额（元）"
          width='200'
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="period"
          label="借款期限"
          width='200'
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.period}} {{periodType[scope.row.periodType] || scope.row.periodType}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width='120'
          fixed="right"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{obCheckStatus[scope.row.status] || scope.row.status}}
          </template>
        </el-table-column>

        <el-table-column
          min-width='320'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <router-link v-permission='["platform:bid:view"]'
                         :to="{path: '/objectManage/ObInfoEditPlatform/'+scope.row.id, query: {isPreview: true}}">
              <el-button size="mini">
                查看
              </el-button>
            </router-link>

            <el-popover
              placement="left"
              width="500"
              trigger="click">
              <el-table :data="gridData"
                        v-loading='loadingRecord'>
                <el-table-column width="180"
                                 property="auditTime"
                                 label="审核时间">
                </el-table-column>
                <el-table-column width="80"
                                 property="name"
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
                @click="handleShowCheckRecord(scope.$index, scope.row)">审核记录
              </el-button>
            </el-popover>


            <router-link
              v-if='scope.row.status == "audited"'
              v-permission='["platform:bid:emergencyEdit"]'
              :to="{path: '/objectManage/ObInfoEditPlatform/'+scope.row.id, query: {isDangerEdit: true}}">
              <el-button type='info'
                         size="mini">
                紧急修改
              </el-button>
            </router-link>

            <el-button
              v-if='scope.row.status == "wait_audit"'
              v-permission='["platform:bid:audit"]'
              size="mini"
              type='success'
              @click="openDialog(scope.$index, scope.row)">审核
            </el-button>

            <el-button
              v-if='scope.row.status == "audited"'
              v-permission='["platform:bid:discard"]'
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">废弃
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

    <el-dialog title="审核"
               width='500px'
               :visible.sync="dialogFormVisible">
      <el-form :model="checkForm">
        <el-form-item label="审核结果">
          <el-radio-group v-model="checkForm.auditFlag">
            <el-radio :label="true">通过</el-radio>
            <el-radio :label="false">不通过</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-input
            :autosize="{ minRows: 3, maxRows: 8}"
            placeholder="请填写通过/不通过原因"
            v-model="checkForm.advice">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDialog">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    components: {},

    data() {
      return {
        showPagination: true,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          size: 10,
          businessTypeName: '',
          productTypeName: '',
          offlineApplyTimeStart: '',
          offlineApplyTimeEnd: '',
          status: '',
          'orderBy': 'updateAt',
          'orderSort': 'DESC'
        },
        dateOrigin: '',
        borrowerType: ENUM.borrowerType,
        obCheckStatus: ENUM.obCheckStatus,
        periodType: {
          'day': '天',
          'month': '个月'
        },

        dialogFormVisible: false,
        currentSelectId: '',
        checkForm: {
          advice: '',
          auditFlag: true
        },
        checkStatus: ENUM.checkStatus,

        platformObStatusTypeMap: ENUM.platformObStatusTypeMap,

        gridData: [],
        loadingRecord: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      formatDate,
      splitDate(str) {
        let temp = str.split(' ')
        return temp[0]
      },
      changeDate(dateArr) {
        this.listQuery.offlineApplyTimeStart = new Date(dateArr[0]).getTime()
        this.listQuery.offlineApplyTimeEnd = new Date(dateArr[1]).getTime()
      },

      resetQuery() {
        this.showPagination = false
        setTimeout(() => {
          this.showPagination = true
        }, 10)
        this.dateOrigin = ''
        this.listQuery = {
          page: 0,
          size: 10
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

        AXIOS.post('/auth/platformBid/index', self.listQuery).then(res => {
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

      handleSubmitAudit(index, row) {
        this.$confirm('已确认录入信息都正确，提交审核？', {
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {

        })
      },

      handleDelete(index, row) {
        this.$confirm('确定废弃该信息？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/auth/platformBid/discard', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '废弃成功!'
            })
            this.getList()
          })
        })
      },

      openDialog(index, row) {
        this.dialogFormVisible = true
        this.currentSelectId = row.id
      },

      validForm() {
        let flag = true
        if (!this.checkForm.advice) {
          this.$message.error('请填写审核备注')
          flag = false
        }
        if (this.checkForm.advice && this.checkForm.advice.length > 200) {
          this.$message.error('备注最多200个字')
          flag = false
        }
        return flag
      },
      confirmDialog() {
        if (this.validForm()) {
          AXIOS.post('/auth/platformBid/audit', {
            'advice': this.checkForm.advice,
            'auditFlag': this.checkForm.auditFlag,
            'id': this.currentSelectId
          }).then(res => {
            this.$message.success('修改审核状态成功')
            this.dialogFormVisible = false
            this.checkForm = {
              advice: '',
              auditFlag: true
            }
            this.getList()
          })
        }
      },

      handleShowCheckRecord: function (index, row) {
        this.gridData = []
        this.loadingRecord = true
        AXIOS.post('/auth/platformBidAudit/auditIndex', {
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


