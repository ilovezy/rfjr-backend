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
          <el-form-item label="姓名">
            <el-input v-model="listQuery.trueName"
                      placeholder="姓名"></el-input>
          </el-form-item>

          <el-form-item label="手机号">
            <el-input v-model.number="listQuery.mobile"
                      placeholder="手机号"></el-input>
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
          prop='trueName'
          label="姓名"
          width='160'>
        </el-table-column>

        <el-table-column
          prop="mobile"
          label="手机号"
          width='140'>
        </el-table-column>

        <el-table-column
          prop="bankName"
          label="银行"
          width='150'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="cardNumber"
          label="卡号"
          width='200'>
        </el-table-column>

        <el-table-column
          prop='createAt'
          label="绑定时间"
          width='180'>
        </el-table-column>

        <el-table-column
          min-width='120'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click='doUnbind(scope.row)'>
              解绑
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
          mobile: ''
        },

        formLabelWidth: '80px',
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,

      doUnbind(row) {
        this.$confirm('确定解绑吗', {
          type: 'warning'
        }).then(() => {
          AXIOS.post('/auth/platformMember/memberUnbindCard', {
            bankCardId: row.id,
            memberId: row.memberId
          }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
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
        AXIOS.post('/auth/platformMember/memberBankCardPageIndex', self.listQuery).then(res => {
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
