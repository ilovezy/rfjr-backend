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
                v-for="item,index in obStatusTypeMap"
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

    <div class="sub-navbar"
         v-permission='["platform:asset:bid:create", "asset:bid:create"]'>
      <div class='subtitle'>操作</div>
      <div class='sub-navbar-btnwrap'>
        <router-link to="/objectManage/ObInfoEdit/add">
          <el-button type="primary">新增</el-button>
        </router-link>
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
        width='180'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="productTypeName"
        label="产品类型"
        width='120'
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
        width='140'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="formatBorrowerMobile"
        width='160'
        label="借款人/法人手机号"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="借款金额（元）"
        width='160'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="period"
        label="借款期限"
        width='140'
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.period}} {{periodType[scope.row.periodType] || scope.row.periodType}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width='120'
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
          <router-link v-if='userType == "asset"'
                       v-permission='["asset:bid:view", "platform:asset:bid:view"]'
                       :to="{path: '/objectManage/ObInfoEdit/'+scope.row.id, query: {isPreview: true}}">
            <el-button size="mini">
              查看
            </el-button>
          </router-link>

          <router-link v-else
                       v-permission='["asset:bid:view", "platform:asset:bid:view"]'
                       :to="{path: '/objectManage/ObInfoEditPlatform/'+scope.row.id, query: {isPreview: true}}">
            <el-button size="mini">
              查看
            </el-button>
          </router-link>

          <el-popover
            placement="left"
            width="500"
            v-if='scope.row.status!="saved"'
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

          <router-link v-permission='["asset:bid:edit", "platform:asset:bid:edit"]'
                       :to="'/objectManage/ObInfoEdit/'+scope.row.id"
                       v-if='scope.row.status != "audited" && scope.row.status != "wait_audit"&& scope.row.status != "discard"  '>
            <el-button type='info'
                       size="mini">
              编辑
            </el-button>
          </router-link>
          <el-button
            size="mini"
            type='success'
            v-permission='["asset:bid:submitAudit", "platform:asset:bid:submitAudit"]'
            v-if='scope.row.status != "audited" && scope.row.status != "wait_audit" && scope.row.status != "discard"  '
            @click="handleSubmitAudit(scope.$index, scope.row)">提交审核
          </el-button>
          <el-button
            size="mini"
            type="danger"
            v-permission='["asset:bid:delete", "platform:asset:bid:delete"]'
            v-if='scope.row.status == "saved" ||scope.row.status == "unaudited"'
            @click="handleDelete(scope.$index, scope.row)">删除
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
    </div></div>
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

        obStatusTypeMap: USER.getUserType() == 'platform' ? ENUM.platformObStatusTypeMap : ENUM.obStatusTypeMap,

        userType: USER.getUserType(),

        gridData: [],
        loadingRecord: false
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,

      splitDate(str){
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

        let apiUrl = this.userType == 'platform' ? '/auth/platformBid/index' : '/auth/assetBid/index'

        AXIOS.post(apiUrl, self.listQuery).then(res => {
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
          AXIOS.post('/auth/assetBid/submitAudit', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '提交审核成功!'
            })
            this.getList()
          })
        })
      },

      handleDelete(index, row) {
        this.$confirm('确定删除该信息？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/auth/assetBid/delete', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
        })
      },

      handleShowCheckRecord: function(index, row) {
        this.gridData = []
        this.loadingRecord = true

        let apiUrl = this.userType == 'platform' ? '/auth/platformBidAudit/auditIndex' : '/auth/platformBidAudit/assetAuditIndex'
        AXIOS.post(apiUrl, {
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


