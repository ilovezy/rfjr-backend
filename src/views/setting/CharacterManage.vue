<template>
  <div class="app-container">
    <h1>角色管理</h1>
    <div :class="'sub-navbar '"
         v-permission='["platform:account:role:create"]'>
      <div class='subtitle'>操作</div>
      <div class='sub-navbar-btnwrap'>
        <router-link to="/setting/CharacterManageEdit/add">
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
          label="id"
          prop='id'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称">
        </el-table-column>
        <el-table-column
          label="账户类型">
          <template slot-scope="scope">
            {{targetType[scope.row.target] || scope.row.target}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createAt"
          label="创建时间">
        </el-table-column>
        <el-table-column
          min-width='220'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <router-link v-permission='["platform:account:role:view"]'
                         :to="{path: '/setting/CharacterManageEdit/'+scope.row.id, query: {isPreview: true}}">
              <el-button size="mini">
                查看
              </el-button>
            </router-link>
            <router-link v-permission='["platform:account:role:edit"]'
                         :to="'/setting/CharacterManageEdit/'+scope.row.id">
              <el-button type='info'
                         size="mini">
                编辑
              </el-button>
            </router-link>
            <el-button
              size="mini"
              type="danger"
              v-permission='["platform:account:role:delete"]'
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination background
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
  import AXIOS from '../../global/Fetch'

  export default {
    data() {
      return {
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          size: 10
        },
        targetType: ENUM.targetType
      }
    },
    created() {
      this.listLoading = true
      setTimeout(() => {
        this.getList()
      }, 1000)
    },
    methods: {
      getList() {
        const self = this
        self.listLoading = true
        AXIOS.post('/auth/role/index', self.listQuery).then(res => {
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

      handleDelete(index, row) {
        this.$confirm('确定删除该角色？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/auth/role/deleteRole', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
        }).catch(() => {

        })
      }
    }
  }
</script>

<style lang="scss"
       scoped>

</style>


