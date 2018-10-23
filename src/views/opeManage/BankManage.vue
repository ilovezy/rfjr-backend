<!--TODO-->
<template>
  <div class="app-container">
    <div class='main-table-wrap'>
      <el-table
        :data="list"
        tooltip-effect="dark"
        style="width: 100%;"
        max-height='600'
        v-loading="listLoading">
        <el-table-column
          label="银行 icon"
          width='160'>
          <template slot-scope="scope">
            <img :src='scope.row.bankIcon'
                 style='width: 80px'
                 alt=''>
          </template>
        </el-table-column>

        <el-table-column
          prop="bankName"
          label="银行名称"
          width='140'>
        </el-table-column>

        <el-table-column
          prop="bankCode"
          label="银行机构编号"
          width='200'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="dayLimit"
          label="充值单日限额"
          width='180'>
        </el-table-column>

        <el-table-column
          prop='singleLimit'
          label="充值单笔限额"
          width='180'>
        </el-table-column>

        <el-table-column
          prop='updateAt'
          label="更新时间"
          width='220'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop='updateBy'
          label="更新人"
          width='180'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          min-width='120'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click='openAuditModal(scope.row)'>
              编辑
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

    <el-dialog title="编辑"
               width='400px'
               :visible.sync="auditModalShow">
      <el-form label-position='left'>
        <el-form-item label="银行名称">
          {{currentName}}
        </el-form-item>
        <el-form-item label="充值单日限额">
          <el-input-number v-model="currentDayLimit"
                           controls-position="right"
                           style='width: 100%;'></el-input-number>
        </el-form-item>
        <el-form-item label="充值单笔限额">
          <el-input-number v-model="currentSingleLimit"
                           controls-position="right"
                           style='width: 100%;'></el-input-number>
        </el-form-item>
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
        },

        formLabelWidth: '80px',
        auditModalShow: false,

        id: '',
        currentName: '',
        currentDayLimit: 0,
        currentSingleLimit: 0,
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,

      openAuditModal(item) {
        this.id = item.id
        this.currentName = item.bankName || 0
        this.currentDayLimit = item.dayLimit || 0
        this.currentSingleLimit = item.singleLimit || 0
        this.auditModalShow = true
      },

      closeAuditDialog() {
        this.id = ''
        this.auditModalShow = false
        this.currentName = ''
        this.currentDayLimit = 0
        this.currentSingleLimit = 0
        this.getList()
      },

      confirmAuditDialog() {
        const self = this
        let param = {
          "dayLimit": self.currentDayLimit,
          "id": self.id,
          "singleLimit": self.currentSingleLimit
        }
        AXIOS.post('/auth/yeePay/editBank', param).then(res => {
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
        this.listQuery = {
          page: 0,
          size: 10,
        }
        this.getList()
      },

      getList() {
        const self = this
        self.listLoading = true
        AXIOS.post('/auth/yeePay/bankIndex', self.listQuery).then(res => {
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


