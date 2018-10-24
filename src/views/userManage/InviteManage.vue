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
          prop='accountStart'
          label="开始号段"
          width='160'>
        </el-table-column>
        <el-table-column
          prop='accountEnd'
          label="结束号段"
          width='160'>
        </el-table-column>
        <el-table-column
          prop='accountIndex'
          label="下一个号段"
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
          prop='createAt'
          label="创建时间">
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
        },

        formLabelWidth: '80px',
        sysUserStatus: {
          freeze: '冻结',
          normal: '正常',
          cancel: '注销'
        },
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,

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
        AXIOS.post('/backend/inviter/config/index', self.listQuery).then(res => {
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
