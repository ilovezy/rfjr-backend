<template>
  <div class="app-container">
    <div class="sub-navbar"
         v-permission='["platform:version:create"]'>
      <div class='subtitle'>操作</div>
      <div class='sub-navbar-btnwrap'>
        <el-button type="primary"
                   @click="addBanner">新增
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
          prop="id"
          label="id"
          width='80'>
        </el-table-column>
        <el-table-column
          prop="type"
          label="平台"
          width='100'>
        </el-table-column>
        <el-table-column prop="description"
                         label="版本描述"
                         width='350'>
        </el-table-column>

        <el-table-column prop="versionNo"
                         label="版本号"
                         width='140'
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="downloadUrl"
          label="下载地址"
          width='300'>
        </el-table-column>

        <el-table-column
          prop="createAt"
          label="创建时间"
          width='180'>
        </el-table-column>

        <el-table-column
          label="是否设为当前版本"
          width='160'
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.useFlag ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否需要强制更新"
          width='160'
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updateFlag ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column
          min-width='140'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type='info'
                       v-permission='["platform:version:edit"]'
                       @click='handleEdit(scope.$index, scope.row)'
                       size="mini">
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


    <el-dialog :title="dialogForm.title"
               :visible.sync="bannerEditShow">
      <el-form :model="dialogForm">
        <el-form-item label="平台"
                      :label-width="formLabelWidth">
          <el-radio v-model="dialogForm.type"
                    label="ios"
                    :disabled='dialogForm.currentStatus == "preview"'>ios
          </el-radio>
          <el-radio v-model="dialogForm.type"
                    label="android"
                    :disabled='dialogForm.currentStatus == "preview"'>android
          </el-radio>
        </el-form-item>

        <el-form-item label="版本描述"
                      :label-width="formLabelWidth">
          <el-input v-model="dialogForm.description"
                    type='textarea'
                    autosize
                    :disabled='dialogForm.currentStatus == "preview"'></el-input>
        </el-form-item>


        <el-form-item label="版本号"
                      :label-width="formLabelWidth">
          <el-input v-model="dialogForm.versionNo"
                    :disabled='dialogForm.currentStatus == "preview"'></el-input>
        </el-form-item>
        <el-form-item label="是否设置为当前版本"
                      :label-width="formLabelWidth">
          <el-switch
            v-model="dialogForm.useFlag">
          </el-switch>
        </el-form-item>
        <el-form-item label="是否需要强制更新"
                      :label-width="formLabelWidth">
          <el-switch
            v-model="dialogForm.updateFlag">
          </el-switch>
        </el-form-item>

        <el-form-item label="上传安装包"
                      :label-width="formLabelWidth">
          <single-file-uploader @update='updateFile'
                                uploadUrl='a/platform/version/upload'
                                :file='dialogForm.downloadUrl'
                                :isPreview='dialogForm.currentStatus == "preview"'></single-file-uploader>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeBannerDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmBannerDialog">确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SingleFileUploader from '@/components/SingleFileUploader'

  export default {
    components: {
      SingleFileUploader
    },
    data() {
      return {
        showPagination: true,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          size: 10,
          type: ''
        },

        // 修改banner
        bannerEditShow: false,
        dialogForm: {
          description: '',
          downloadUrl: '',
          type: '',
          versionNo: '',
          currentStatus: '',
          id: '',
          updateFlag: false,
          useFlag: false,
        },

        typeMap: [{
          label: 'ios',
          value: 'ios',
        }, {
          label: 'android',
          value: 'android',
        },],
        formLabelWidth: '180px',
      }
    },

    created() {
      this.getList()
    },

    methods: {
      handleEdit: _.debounce(function (index, row) {
        const id = row.id

        AXIOS.post('/a/platform/version/view', {id}).then(res => {
          this.dialogForm = res || {}
          this.dialogForm.title = '编辑'
          this.dialogForm.currentStatus = 'edit'
          this.bannerEditShow = true
        }).catch((res) => {
        })
      }, true, 1000),

      addBanner() {
        this.dialogForm = {
          title: '新增',
          description: '',
          downloadUrl: '',
          type: '',
          versionNo: '',
          currentStatus: '',
          id: '',
          updateFlag: false,
          useFlag: false,
        }
        this.bannerEditShow = true
      },

      updateFile(file) {
        this.dialogForm.downloadUrl = file.key
      },

      closeBannerDialog() {
        this.bannerEditShow = false
        this.dialogForm = {
          title: '',
          description: '',
          downloadUrl: '',
          type: '',
          versionNo: '',
          currentStatus: '',
          id: '',
          updateFlag: false,
          useFlag: false,
        }
        this.getList()
      },

      confirmBannerDialog: _.debounce(function () {
        const self = this
        const dialogForm = this.dialogForm || {}
        let currentStatus = dialogForm.currentStatus
        if (currentStatus == 'preview') {
          this.closeBannerDialog()
        } else {
          if (self.validForm()) {
            const apiUrl = currentStatus == 'edit' ? '/a/platform/version/edit' : '/a/platform/version/create'
            AXIOS.post(apiUrl, dialogForm).then(res => {
              self.$message({
                type: 'success',
                message: currentStatus == 'edit' ? '编辑成功' : '新增成功'
              })
              self.closeBannerDialog()
            }).catch((res) => {
            })
          }
        }
      }, 3000, true),

      validForm() {
        let flag = true
        const dialogForm = this.dialogForm || {}
        console.log(dialogForm)
        if (!dialogForm.description) {
          this.$message.error('请填写 description')
          flag = false
        }
        if (!dialogForm.type) {
          this.$message.error('请填写 type')
          flag = false
        }
        if (!dialogForm.versionNo) {
          this.$message.error('请填写 versionNo')
          flag = false
        }
        return flag
      },

      getList() {
        const self = this
        self.listLoading = true
        AXIOS.post('/a/platform/version/index', self.listQuery).then(res => {
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
    }
  }
</script>

<style lang="scss"
       scoped>

</style>


