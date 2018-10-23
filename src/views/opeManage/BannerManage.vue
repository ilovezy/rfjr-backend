<template>
  <div class="app-container">
    <div class="sub-navbar"
         v-permission='["platform:asset:bid:create", "asset:bid:create"]'>
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
          prop="sort"
          label="排列顺序"
          width='140'>
        </el-table-column>

        <el-table-column
          label="banner图片"
          width='200'
          show-overflow-tooltip>
          <template slot-scope='scope'>
            <img :src='scope.row.image'
                 alt=''>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="标题"
          width='200'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="更新时间"
          width='180'>
          <template slot-scope="scope">
            {{scope.row.updateAt || scope.row.createAt}}
          </template>
        </el-table-column>

        <el-table-column
          label="显示状态"
          width='120'
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{bannerStatus[scope.row.status] || scope.row.status}}
          </template>
        </el-table-column>

        <el-table-column
          prop='viewLocation'
          label="显示位置"
          width='160'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop="href"
          label="链接"
          width='300'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          min-width='240'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button type='info'
                       @click='handleEdit(scope.$index, scope.row)'
                       size="mini">
              编辑
            </el-button>

            <el-button
              size="mini"
              type='success'
              v-if='scope.row.status != "enable"'
              v-permission='["asset:bid:submitAudit", "platform:asset:bid:submitAudit"]'
              @click="handleOpenEnable(scope.$index, scope.row)">生效
            </el-button>

            <el-button
              size="mini"
              type='warning'
              v-if='scope.row.status == "enable"'
              v-permission='["asset:bid:submitAudit", "platform:asset:bid:submitAudit"]'
              @click="handleDisable(scope.$index, scope.row)">停用
            </el-button>

            <el-button
              size="mini"
              type="danger"
              v-permission='["asset:bid:delete", "platform:asset:bid:delete"]'
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
      </div>
    </div>


    <el-dialog :title="dialogForm.title"
               :visible.sync="bannerEditShow">
      <el-form :model="dialogForm">
        <el-form-item label="标题"
                      :label-width="formLabelWidth">
          <el-input v-model="dialogForm.name"
                    :disabled='dialogForm.currentStatus == "preview"'></el-input>
        </el-form-item>

        <el-form-item label="链接"
                      :label-width="formLabelWidth">
          <el-input v-model="dialogForm.href"
                    :disabled='dialogForm.currentStatus == "preview"'></el-input>
        </el-form-item>

        <el-form-item label="展示"
                      :label-width="formLabelWidth">
          <el-checkbox v-model="appViewFlag">移动端</el-checkbox>

          <el-checkbox v-model="h5ViewFlag">H5</el-checkbox>
        </el-form-item>

        <el-form-item label="顺序"
                      :label-width="formLabelWidth">
          <el-input v-model.number="dialogForm.sort"
                    type='number'
                    :disabled='dialogForm.currentStatus == "preview"'></el-input>
        </el-form-item>

        <el-form-item label="图片"
                      :label-width="formLabelWidth">
          <single-img-uploader @update='updateFile'
                               uploadUrl='auth/cmsBanner/uploadBanner'
                               :file='dialogForm.image'
                               :isSingleImg='true'
                               :isPreview='dialogForm.currentStatus == "preview"'></single-img-uploader>
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
  import SingleImgUploader from '@/components/SingleImgUploader'

  export default {
    components: {
      SingleImgUploader
    },
    data() {
      return {
        showPagination: true,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          size: 10
        },

        bannerPos: ENUM.bannerPos,
        bannerPosMap: ENUM.bannerPosMap,

        // 修改banner
        bannerEditShow: false,
        dialogForm: {
          title: '',
          currentStatus: '',
          id: '',
          name: '',
          href: '',
          image: '',

        },
        appViewFlag: false,
        h5ViewFlag: false,
        formLabelWidth: '120px',

        bannerStatus: {
          'saved': '存盘',
          'enable': '启用',
          'disabled': '停用'
        },
      }
    },

    created() {
      this.getList()
    },

    methods: {
      handleEdit(index, row, isPreview) {
        const id = row.id

        AXIOS.post('/auth/cmsBanner/viewBanner', {id}).then(res => {
          this.dialogForm = res || {}
          this.dialogForm.title = isPreview ? '查看' : '编辑'
          this.dialogForm.currentStatus = isPreview ? 'preview' : 'edit'
          this.appViewFlag = res.appViewFlag
          this.h5ViewFlag = res.h5ViewFlag
          this.bannerEditShow = true
        }).catch((res) => {
        })
      },

      addBanner() {
        this.dialogForm = {
          title: '新增',
          currentStatus: '',
          id: '',
          name: '',
          href: '',
          image: ''
        }
        this.bannerEditShow = true
      },

      updateFile(file) {
        this.dialogForm.image = file
      },

      closeBannerDialog() {
        this.bannerEditShow = false
        this.appViewFlag = false
        this.h5ViewFlag = false
        this.dialogForm = {
          title: '',
          currentStatus: '',
          id: '',
          name: '',
          href: '',
          image: '',
        }
        this.getList()
      },

      confirmBannerDialog() {
        const self = this
        const dialogForm = this.dialogForm || {}
        dialogForm.appViewFlag = this.appViewFlag
        dialogForm.h5ViewFlag = this.h5ViewFlag
        const currentStatus = dialogForm.currentStatus
        if (currentStatus == 'preview') {
          this.closeBannerDialog()
        } else {
          if (this.validForm()) {
            const apiUrl = currentStatus == 'edit' ? '/auth/cmsBanner/editBanner' : '/auth/cmsBanner/createBanner'
            AXIOS.post(apiUrl, dialogForm).then(res => {
              this.$message({
                type: 'success',
                message: currentStatus == 'edit' ? '编辑成功' : '新增成功'
              })
              this.closeBannerDialog()
            }).catch((res) => {
            })
          }
        }
      },

      validForm() {
        let flag = true
        const dialogForm = this.dialogForm || {}
        console.log(dialogForm)
        if (!dialogForm.name) {
          this.$message.error('请填写标题')
          flag = false
        }
        if (!this.appViewFlag && !this.h5ViewFlag) {
          this.$message.error('请选择展示位置')
          flag = false
        }
        if (!dialogForm.image) {
          this.$message.error('请上传banner图片')
          flag = false
        }
        return flag
      },

      resetQuery() {
        this.showPagination = false
        setTimeout(() => {
          this.showPagination = true
        }, 10)
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

        // TODO 数组图片渲染问题
        AXIOS.post('/auth/cmsBanner/index', self.listQuery).then(res => {
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

      handleOpenEnable(index, row) {
        this.$confirm('确定生效吗', {
          type: 'warning'
        }).then(() => {
          AXIOS.post('/auth/cmsBanner/enableBanner', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
        })
      },

      handleDisable(index, row) {
        this.$confirm('确定停用吗', {
          type: 'warning'
        }).then(() => {
          AXIOS.post('/auth/cmsBanner/disableBanner', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getList()
          })
        })
      },

      handleDelete(index, row) {
        this.$confirm('确定删除该信息？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/auth/cmsBanner/deleteBanner', {
            id: row.id
          }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
        })
      }
    }
  }
</script>

<style lang="scss"
       scoped>

</style>


