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
          <el-form-item label="公告名称">
            <el-input v-model="listQuery.name"
                      placeholder="公告名称"></el-input>
          </el-form-item>

          <el-form-item label="显示位置">
            <el-select v-model="listQuery.pos"
                       placeholder="请选择显示位置">
              <el-option
                v-for="item,index in posMap"
                :key="'posMap' + index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="显示状态">
            <el-select v-model="listQuery.status"
                       placeholder="请选择显示状态">
              <el-option
                v-for="item,index in enterStatusMap"
                :key="'enterStatusMap' + index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="sub-navbar"
         v-permission='["platform:asset:bid:create", "asset:bid:create"]'>
      <div class='subtitle'>操作</div>
      <div class='sub-navbar-btnwrap'>
        <el-button type="primary"
                   @click="addArticle">新增
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
          prop="name"
          label="公告名称"
          width='200'
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          prop='viewLocation'
          label="显示位置"
          width='160'
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
          min-width='240'
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button @click='handlePreview(scope.$index, scope.row)'
                       size="mini">
              查看
            </el-button>

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
               v-if='enableDialog'
               @close='closeArticleDialog'
               :visible.sync="bannerEditShow">
      <el-form :model="dialogForm">
        <el-form-item label="公告名称"
                      :label-width="formLabelWidth">
          <el-input v-model="dialogForm.name"></el-input>
        </el-form-item>

        <el-form-item label="展示"
                      :label-width="formLabelWidth">
          <el-checkbox v-model="appViewFlag">移动端</el-checkbox>

          <el-checkbox v-model="h5ViewFlag">H5</el-checkbox>
        </el-form-item>

        <el-form-item label="公告内容"
                      :label-width="formLabelWidth">
          <Tinymce :height=400
                   ref="editor"
                   v-model="content"/>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeArticleDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirmArticleDialog">确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="previewName"
               :visible.sync="showPreview">
      <div v-html='previewContent'></div>
    </el-dialog>
  </div>
</template>

<script>
  import SingleImgUploader from '@/components/SingleImgUploader'
  import Tinymce from '@/components/Tinymce'

  export default {
    components: {
      SingleImgUploader,
      Tinymce,
    },
    data() {
      return {
        showPagination: true,
        enableDialog: true,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          page: 0,
          size: 10,
          name: '',
          status: '',
          pos: ''
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
          sort: 0
        },
        content: '',
        appViewFlag: false,
        h5ViewFlag: false,
        formLabelWidth: '120px',

        bannerStatus: {
          'saved': '存盘',
          'enable': '启用',
          'disable': '停用'
        },
        enterStatusMap: [
          {value: 'enable', label: '启用',},
          {value: 'disable', label: '停用',},
        ],
        posMap: [
          {value: 'app', label: '移动端',},
          {value: 'h5', label: 'h5',},
        ],
        previewName: '',
        previewContent: '',
        showPreview: false,
      }
    },

    created() {
      this.getList()
    },

    methods: {
      handlePreview(index, row) {
        this.previewName = row.name
        this.previewContent = row.content
        this.showPreview = true
      },

      handleEdit(index, row, isPreview) {
        const id = row.id
        AXIOS.post('/auth/cmsArticle/viewArticle', {id}).then(res => {
          this.dialogForm = res || {}
          this.dialogForm.title = isPreview ? '查看' : '编辑'
          this.dialogForm.currentStatus = isPreview ? 'preview' : 'edit'
          this.content = res.content
          this.appViewFlag = res.appViewFlag
          this.h5ViewFlag = res.h5ViewFlag
          this.bannerEditShow = true
        }).catch((res) => {
        })
      },

      addArticle() {
        this.dialogForm = {
          title: '新增',
          currentStatus: '',
          id: '',
          name: '',
          sort: 0
        }
        this.content = ''
        this.bannerEditShow = true
      },

      updateFile(file) {
        this.dialogForm.image = file
      },

      closeArticleDialog() {
        this.bannerEditShow = false
        this.content = ''
        this.appViewFlag = false
        this.h5ViewFlag = false
        this.dialogForm = {
          title: '',
          currentStatus: '',
          id: '',
          name: '',
          sort: 0
        }

        this.enableDialog = false
        setTimeout(() => {
          this.enableDialog = true
        }, 10)
        this.getList()
      },

      confirmArticleDialog() {
        const self = this
        const dialogForm = this.dialogForm || {}
        dialogForm.content = this.content
        dialogForm.appViewFlag = this.appViewFlag
        dialogForm.h5ViewFlag = this.h5ViewFlag
        const currentStatus = dialogForm.currentStatus
        if (currentStatus == 'preview') {
          this.closeArticleDialog()
        } else {
          if (this.validForm()) {
            const apiUrl = currentStatus == 'edit' ? '/auth/cmsArticle/editArticle' : '/auth/cmsArticle/createArticle'
            AXIOS.post(apiUrl, dialogForm).then(res => {
              this.$message({
                type: 'success',
                message: currentStatus == 'edit' ? '编辑成功' : '新增成功'
              })
              this.closeArticleDialog()
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
          this.$message.error('请填写公告名称')
          flag = false
        }
        if (!this.appViewFlag && !this.h5ViewFlag) {
          this.$message.error('请选择展示位置')
          flag = false
        }
        if (!this.content) {
          this.$message.error('请填写公告内容')
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
        let listQuery = self.listQuery || {}
        delete listQuery.appViewFlag
        delete listQuery.h5ViewFlag
        if (listQuery.pos == 'app') {
          listQuery.appViewFlag = true
        }
        if (listQuery.pos == 'h5') {
          listQuery.h5ViewFlag = true
        }
        AXIOS.post('/auth/cmsArticle/index', listQuery).then(res => {
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
          AXIOS.post('/auth/cmsArticle/enableArticle', {
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
          AXIOS.post('/auth/cmsArticle/disableArticle', {
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
        this.$confirm('确定删除该公告？', {
          type: 'error'
        }).then(() => {
          AXIOS.post('/auth/cmsArticle/deleteArticle', {
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
