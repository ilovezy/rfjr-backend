<template>
  <div class="app-container">
    <h1>字典管理</h1>
    <div :class="'sub-navbar '"
         v-permission='["platform:account:role:create"]'>
      <div class='subtitle'>操作</div>
      <div class='sub-navbar-btnwrap'>
        <el-button type="primary"
                   @click='openEditModal("add")'>新增
        </el-button>
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
          prop="groupName"
          label="groupName">
        </el-table-column>

        <el-table-column
          prop="label"
          label="label">
        </el-table-column>
        <el-table-column
          prop="description"
          label="description">
        </el-table-column>
        <el-table-column
          prop="key"
          label="key">
        </el-table-column>
        <el-table-column
          prop="value"
          label="value">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="sort">
        </el-table-column>

        <el-table-column
          min-width='220'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click='openEditModal(scope.row.id)'>
              编辑
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

    <el-dialog title="编辑字典"
               width='400px'
               :visible.sync="modalShow">
      <el-form label-position='left'>
        <el-form-item label="groupName"
                      :label-width="formLabelWidth">
          <el-input v-model='dialogForm.groupName'></el-input>
        </el-form-item>

        <el-form-item label="label"
                      :label-width="formLabelWidth">
          <el-input v-model='dialogForm.label'></el-input>
        </el-form-item>

        <el-form-item label="description"
                      :label-width="formLabelWidth">
          <el-input v-model='dialogForm.description'></el-input>
        </el-form-item>

        <el-form-item label="key"
                      :label-width="formLabelWidth">
          <el-input v-model='dialogForm.key'></el-input>
        </el-form-item>

        <el-form-item label="value"
                      :label-width="formLabelWidth">
          <el-input v-model='dialogForm.value'></el-input>
        </el-form-item>

        <el-form-item label="sort"
                      :label-width="formLabelWidth">
          <el-input-number v-model="dialogForm.sort"
                           controls-position="right"
                           style='width: 100%;'></el-input-number>
        </el-form-item>

      </el-form>

      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmEditDialog">确 定
        </el-button>
      </div>
    </el-dialog>
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
        modalShow: false,
        id: '',
        formLabelWidth: '100px',

        dialogForm: {
          description: '',
          groupName: '',
          key: '',
          label: '',
          sort: '',
          value: '',
        }
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
        AXIOS.post('/auth/systemDict/index', self.listQuery).then(res => {
          self.list = res.content || []
          self.total = res.totalElements || 0

          self.listLoading = false
        }).catch((res) => {
          self.listLoading = false
        })
      },

      openEditModal(id) {
        const self = this
        self.resetDialogForm();
        if (id == 'add') {
          this.modalShow = true
        } else {
          this.id = id
          AXIOS.post('/auth/systemDict/viewDict', {id}).then(res => {
            self.dialogForm = res || {}
            this.modalShow = true
          })
        }
      },

      closeEditDialog() {
        this.modalShow = false
        this.id = ''
        this.getList()
      },

      resetDialogForm() {
        this.dialogForm = {
          description: '',
          groupName: '',
          key: '',
          label: '',
          sort: '',
          value: '',
        }
        this.id = ''
      },

      validForm() {
        let flag = true
        const dialogForm = this.dialogForm || {}
        if (!dialogForm.groupName) {
          this.$message.error('请填写 groupName')
          flag = false
        }
        if (!dialogForm.label) {
          this.$message.error('请填写 label')
          flag = false
        }
        if (!dialogForm.description) {
          this.$message.error('请填写 description')
          flag = false
        }
        if (!dialogForm.key) {
          this.$message.error('请填写 key')
          flag = false
        }
        if (!dialogForm.value) {
          this.$message.error('请填写 value')
          flag = false
        }

        return flag
      },

      confirmEditDialog() {
        const self = this
        let param = this.dialogForm
        if (this.validForm()) {
          if (this.id) {
            param.id = this.id
            AXIOS.post('/auth/systemDict/editDict', param).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.closeEditDialog()
            })
          } else {
            AXIOS.post('/auth/systemDict/createDict', param).then(res => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.closeEditDialog()
            })
          }
        }
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


