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
            <el-input v-model="listQuery.userName"
                      placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
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

    <div :class="'sub-navbar '"
         v-permission='["platform:account:user:create"]'>
      <div class='subtitle'>操作</div>
      <div class='sub-navbar-btnwrap'>
        <router-link to="/setting/UserManageEdit/add">
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
          prop="userName"
          label="用户名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            {{sysUserStatus[scope.row.status] || scope.row.status}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createAt"
          label="创建时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          min-width='280'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <router-link v-permission='["platform:account:user:view"]'
                         :to="{path: '/setting/UserManageEdit/'+scope.row.id, query: {isPreview: true}}">
              <el-button size="mini">
                查看
              </el-button>
            </router-link>
            <router-link v-permission='["platform:account:user:edit"]'
                         v-if='scope.row.status != "cancel"'
                         :to="'/setting/UserManageEdit/'+scope.row.id">
              <el-button type='info'
                         size="mini">
                编辑
              </el-button>
            </router-link>

            <!-- TODO 冻结和解冻权限 -->
            <el-button size='mini'
                       type='primary'
                       v-permission='["platform:account:user:freeze"]'
                       @click="handleToggleFreeze(scope.$index, scope.row, scope.row.status == 'freeze')"
                       v-if='scope.row.status != "freeze" && scope.row.status != "cancel"'>冻结
            </el-button>
            <el-button size='mini'
                       type='warning'
                       v-permission='["platform:account:user:unfreeze"]'
                       @click="handleToggleFreeze(scope.$index, scope.row, scope.row.status == 'freeze')"
                       v-if='scope.row.status == "freeze" && scope.row.status != "cancel"'>解冻
            </el-button>

            <el-button
              v-permission='["platform:account:user:cancel"]'
              v-if='scope.row.status != "cancel"'
              size="mini"
              type="danger"
              @click="handleCancel(scope.$index, scope.row)">注销
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
  import AXIOS from '../../global/Fetch'

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

          userName: '',
          crTimeStart: '',
          crTimeEnd: ''
        },
        dateOrigin: '',

        sysUserStatus: {
          freeze: '冻结',
          normal: '正常',
          cancel: '注销'
        },
        targetType: ENUM.targetType
      }
    },
    created() {
      this.getList()
    },
    methods: {
      changeDate(dateArr) {
        this.listQuery.crTimeStart = new Date(dateArr[0]).getTime()
        this.listQuery.crTimeEnd = new Date(dateArr[1]).getTime()
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

        AXIOS.post('/auth/user/index', self.listQuery).then(res => {
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

      handlePreview(index, row) {
        AXIOS.post('/auth/user/viewPlatformUser', {
          id: row.id
        }).then(res => {
          this.$message({
            type: 'success',
            message: '冻结成功!'
          })
        })
      },

      handleToggleFreeze(index, row, freeze) {
        const tip = freeze ? '解冻' : '冻结'
        const url = freeze ? '/auth/user/unfreezePlatformUser' : '/auth/user/freezePlatformUser'
        this.$confirm('确定' + tip + '该用户吗？', {
          type: 'warning'
        }).then(() => {
          AXIOS.post(url, {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: tip + '成功!'
            })
            this.getList()
          })
        })
      },

      handleCancel(index, row) {
        this.$confirm('确定注销？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/auth/user/cancelPlatformUser', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '注销成功!'
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
  @import "src/styles/mixin.scss";

  .test {
    @include flex-between;
  }
</style>


