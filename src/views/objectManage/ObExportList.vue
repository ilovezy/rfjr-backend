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
          <el-button type='warning'
                     v-if='userType == "capital"'
                     v-permission='["capital:borrower:enterprise:export"]'
                     :disabled='!enableExport'
                     @click='exportExcel()'>导出
          </el-button>
        </div>
      </div>
      <div class='search-control'>
        <el-form :inline="true"
                 class="demo-form-inline">
          <el-form-item label="资产方">
            <el-input v-model="listQuery.merchantAssetName"
                      placeholder="资产方"></el-input>
          </el-form-item>
          <el-form-item label="业务类型">
            <el-input v-model="listQuery.businessTypeName"
                      placeholder="业务类型"></el-input>
          </el-form-item>
          <el-form-item label="产品类型">
            <el-input v-model="listQuery.productTypeName"
                      placeholder="产品类型"></el-input>
          </el-form-item>

          <el-form-item label="导出状态"
                        v-if='userType == "capital"'>
            <el-select v-model="listQuery.exportFlag"
                       placeholder="请选择"
                       @change='doSearch'>
              <el-option
                v-for="item,index in exportFlagMap"
                :key="'export' + index"
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
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="listLoading">
      <el-table-column
        fixed="left"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="id"
        show-overflow-tooltip>
      </el-table-column>
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
        width='120'
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
        width='120'
        show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.period}} {{periodType[scope.row.periodType] || scope.row.periodType}}
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="状态"-->
      <!--width='120'-->
      <!--show-overflow-tooltip>-->
      <!--<template slot-scope="scope">-->
      <!--{{obCheckStatus[scope.row.status] || scope.row.status}}-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column
        v-if='userType == "capital"'
        fixed="right"
        label="导出状态">
        <template slot-scope="scope">
          {{scope.row.exportFlag ? '已导出' : '未导出'}}
        </template>
      </el-table-column>

      <el-table-column
        min-width='120'
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <router-link :to="{path: '/objectManage/ObInfoEditPlatform/'+scope.row.id, query: {isPreview: true}}">
            <el-button size="mini">
              查看
            </el-button>
          </router-link>
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
    </div></div>
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
          merchantAssetName: '',
          businessTypeName: '',
          productTypeName: '',
          status: 'audited'
        },

        borrowerType: ENUM.borrowerType,
        obCheckStatus: ENUM.obCheckStatus,
        periodType: {
          'day': '天',
          'month': '个月'
        },

        userType: USER.getUserType(),

        exportFlagMap: [{
          label: '已导出',
          value: true
        }, {
          label: '未导出',
          value: false
        }],

        multipleSelection: []
      }
    },
    created() {
      this.getList()
    },
    computed: {
      enableExport() {
        let flag = false
        if (isLongArr(this.multipleSelection)) {
          flag = true
        }
        return flag
      }
    },

    methods: {
      formatDate,
      splitDate(str) {
        let temp = str.split(' ')
        return temp[0]
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
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
          status: 'audited'
        }
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

      // TODO 这里要改成选择多选之后导出
      exportExcel() {
        let ids = _.pluck(this.multipleSelection, 'id') || []
        if (isLongArr(ids)) {
          fileExport('auth/platformBid/export', {
            ids
          })
        } else {
          this.$message.warning('请选择要导出的标的')
        }
      }
    }
  }
</script>

<style lang="scss"
       scoped>
</style>


