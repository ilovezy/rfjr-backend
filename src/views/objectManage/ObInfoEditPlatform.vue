<template>
  <div class="app-container">
    <h2>{{topTitle}}</h2>
    <el-form :model="formData"
             :rules="rules"
             ref="ruleForm"
             label-position="left"
             label-width="180px"
             class="demo-ruleForm">
      <cc-panel :title='"信息来源"'>
        <el-row :gutter="50">
          <el-col :span="6">
            <el-form-item label="资产方"
                          label-width='60px'>
              {{formData.merchantAssetName}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务类型"
                          prop="name"
                          label-width='80px'>
              {{formData.businessTypeName}}
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="产品类型"
                          label-width='80px'
                          prop="name">
              {{formData.productTypeName}}
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="线下申请时间"
                          label-width='100px'
                          prop="name">
              {{formData.offlineApplyTime}}
            </el-form-item>
          </el-col>
        </el-row>
      </cc-panel>

      <cc-panel title='借款人信息'>
        <el-row :gutter="100"
                type='flex'
                align='center'>
          <el-col :span="6"
                  style='display: flex;align-items:center'>
            <el-form-item label="借款人类型"
                          label-width='100px'>
              {{borrowerTypeMap[formData.borrowerType]}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if='formData.borrowerType == "personal"'
                          label="借款人姓名"
                          prop="borrowerId">
              {{formData.borrowerName}}
            </el-form-item>

            <el-form-item v-if='formData.borrowerType == "enterprise"'
                          label="借款人企业姓名"
                          prop="borrowerId">
              {{formData.borrowerName}}
            </el-form-item>

            <el-form-item label="借款金额"
                          prop="period">
              {{formData.amount}}元
            </el-form-item>

            <el-form-item label="借款期限">
              {{formData.period}} {{periodType[formData.periodType]}}
            </el-form-item>
          </el-col>
        </el-row>
      </cc-panel>

      <cc-panel title='相关证明图片'>
        <list-img-uploader v-for='item,index in imgFileList'
                           @update='updateFile'
                           :propItem='item'
                           :fileList='item.list'
                           :isPreview='true'
                           :key='"imgFileList" + index'>
        </list-img-uploader>

        <list-img-uploader v-for='item,index in otherFileList'
                           @update='updateFile'
                           :propItem='item'
                           :fileList='item.list'
                           :isPreview='!isDangerEdit'
                           :key='"otherFileList" + index'>
        </list-img-uploader>
      </cc-panel>

      <el-row class='text-right fixed-footer'>
        <el-col :span='24'
                v-if='isPreview'>
          <el-button @click="closeCurrentTab">返回</el-button>
        </el-col>
        <el-col :span='24'
                v-else>
          <el-button @click="closeCurrentTab">取消</el-button>
          <el-button type="primary"
                     @click="submitForm">紧急修改
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import ListImgUploader from '../userManage/component/ListImgUploader'

  export default {
    name: 'ObInfoEditPlatform',
    components: {
      ListImgUploader
    },

    data() {
      return {
        id: '',
        isPreview: false,
        isDangerEdit: false,
        formData: {
          borrowerType: 'personal',
          businessTypeId: '',
          productTypeId: '',
          offlineApplyTime: '',

          borrowerId: '',
          borrowerName: '',

          amount: 0,
          period: 0,
          periodType: 'day'
        },
        rules: {},

        topTitle: '',
        periodType: {
          'day': '天',
          'month': '个月'
        },
        borrowerTypeMap: {
          personal: '个人',
          enterprise: '企业'
        },

        imgFileList: [],
        otherFileList: [{
          title: '其他',
          desc: '其他信息',
          list: [],
          id: 3306021992, // 默认otherId，前端暂时自定义了
          required: false
        }]
      }
    },

    created() {
      this.id = this.$route.params && this.$route.params.id
      this.isPreview = this.$route.query && !!this.$route.query.isPreview
      this.isDangerEdit = this.$route.query && !!this.$route.query.isDangerEdit

      if (this.id && this.id != 'add') {
        this.getUserInfo()
        this.topTitle = '紧急修改'
      }
      if (this.isPreview) {
        this.topTitle = '查看'
      }
    },

    methods: {
      formatToImgList(res) {
        res.map((item, index) => {
          item.title = item.attachName
          item.desc = item.attachDesc
          item.list = []
          item.required = item.requireFlag
        })
        this.$set(this, 'imgFileList', res)
      },

      getUserInfo() {
        const self = this
        const id = this.id
        AXIOS.post('/auth/platformBid/view', {
          id
        }).then(res => {
          self.formData = res.platformBidBo || {}
          self.setImgFileList(res.bidConfigAttachmentAttachBos || [])
          self.setOtherFileList(res.otherAttachmentPos || [])
        })
      },

      setImgFileList(bidConfigAttachmentAttachBos) {
        const self = this
        let tempArr = []
        bidConfigAttachmentAttachBos.map((item, index) => {
          let tempItem = {}
          tempItem.list = item.platformBidAttachmentPos || []
          let bidAttachmentConfigPo = item.bidConfigAttachmentPo || {}
          tempItem.title = bidAttachmentConfigPo.attachName
          tempItem.desc = bidAttachmentConfigPo.attachDesc
          tempItem.required = bidAttachmentConfigPo.requireFlag
          tempItem.id = bidAttachmentConfigPo.id
          tempArr.push(tempItem)
        })

        this.$set(this, 'imgFileList', tempArr)
      },

      setOtherFileList(arr) {
        const self = this
        let tempOhter = [{
          title: '其他',
          desc: '其他信息',
          list: arr || [],
          id: 3306021992, // 默认otherId，前端暂时自定义了
          required: false
        }]
        this.$set(this, 'otherFileList', tempOhter)
      },
      updateFile(id, list) {
        this.imgFileList.map((item, index) => {
          if (item.id == id) {
            item.list = list
          }
        })
      },

      updateOtherFile(id, list) {
        this.otherFileList.map((item, index) => {
          if (item.id == id) {
            item.list = list
          }
        })
      },

      submitForm: _.debounce(function(formName) {
        const self = this

        let tempArr = []
        this.otherFileList.map((item) => {
          if (isLongArr(item.list)) {
            item.list.map((item2) => {
              tempArr.push(item2)
            })
          }
        })
        AXIOS.post('/auth/platformBid/rectify', {
          bidId: this.id,
          bidAttachments: tempArr
        }).then(res => {
          self.$message.success( '紧急修改成功')
          self.closeCurrentTab()
        })
      }, 1000, true)
    }
  }
</script>

<style lang='scss'
       scoped>
  .app-container {
    padding-bottom: 100px;
    .fixed-footer {
      position: fixed;
      width: 100%;
      bottom: 0px;
      right: 0;
      padding: 20px;
      background: #fff;
      border-top: 1px solid #eee;
    }
  }
</style>
