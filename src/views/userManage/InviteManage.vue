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
          prop='memberId'
          label="邀请码"
          width='160'>
        </el-table-column>

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
          prop='createAt'
          label="创建时间">
        </el-table-column>

        <el-table-column
          min-width='220'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>

            <el-button
              size="mini"
              @click="handleShowLink(scope.row.memberId)">查看推广链接
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
      title="推广链接"
      :visible.sync="showLink"
      width="700px">
      <div style='font-size: 18px;margin-bottom: 20px;'>
        web推广链接： {{webLink}}
      </div>
      <div style='font-size: 18px;margin-bottom: 20px;'>
        h5推广链接： {{h5Link}}
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
        },

        formLabelWidth: '80px',
        sysUserStatus: {
          freeze: '冻结',
          normal: '正常',
          cancel: '注销'
        },

        showLink: false,
        webLink: '',
        h5Link: '',
      }
    },

    created() {
      this.getList()
    },

    methods: {
      formatDate,
      handleShowLink(id) {
        this.showLink = true
        this.webLink = location.origin + '/web/#/register?inviteId=' + id
        this.h5Link = location.origin + '/h5/#/register?inviteId=' + id
      },
      handleDelete(index, row) {
        this.$confirm('确定删除？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/backend/inviter/config/account/del', {
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
