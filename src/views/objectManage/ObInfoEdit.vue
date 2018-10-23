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
              {{assetInfo.name}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="业务类型"
                          prop="name"
                          label-width='80px'>
              <el-select v-model="formData.businessTypeId"
                         placeholder="请选择"
                         @change='getProductType'
                         :disabled='isPreview'>
                <el-option
                  v-for="item,index in bidBusinessTypeOptions"
                  :key="'bid' + index"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="产品类型"
                          label-width='80px'
                          prop="name">
              <el-select v-model="formData.productTypeId"
                         placeholder="请选择"
                         @change='getBidInit'
                         :disabled='isPreview'>
                <el-option
                  v-for="item,index in productTypeOptions"
                  :key="'product' + index"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="线下申请时间"
                          label-width='100px'
                          prop="name">
              <el-date-picker placeholder="选择日期"
                              v-model="formData.offlineApplyTime"
                              style="width: 100%;"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              :disabled='isPreview'></el-date-picker>
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
              <el-select v-model="formData.borrowerType"
                         @change='changeBorrowerType'
                         placeholder="请选择借款人类型"
                         :disabled='isPreview'>
                <el-option label="个人"
                           value="personal"></el-option>
                <el-option label="企业"
                           value="enterprise"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if='formData.borrowerType == "personal"'
                          label="借款人姓名"
                          prop="borrowerId">
              <el-select
                v-model="formData.borrowerId"
                filterable
                placeholder="请输入借款人姓名"
                style='width: 100%'
                :loading="loadingPersonal"
                :disabled='isPreview'>
                <el-option
                  v-for="item, index in borrowerPersonalList"
                  :key="'borrowerPersonalList' + index"
                  :label="(item.trueName || '') + ' (' + item.legalIdentity + ')'"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-if='formData.borrowerType == "enterprise"'
                          label="借款人企业姓名"
                          prop="borrowerId">
              <el-select
                v-model="formData.borrowerId"
                filterable
                placeholder="请输入借款人企业姓名"
                style='width: 100%'
                :loading="loadingEnterprise"
                :disabled='isPreview'>
                <el-option
                  v-for="item, index in borrowerEnterpriseList"
                  :key="'borrowerEnterpriseList' + index"
                  :label="(item.name || '') + ' (' + item.legalMobile + ')'"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="借款金额"
                          prop="period">
              <el-input-number v-model="formData.amount"
                               :controls='false'
                               class='input-num-withAppend'
                               :min="0"
                               :max="formData.borrowerType == 'personal' ? 200000 : 1000000"
                               :disabled='isPreview'>
                <template slot="append">元</template>
              </el-input-number>
              <span class='text-info'>单笔最大 {{formData.borrowerType == 'personal' ? 20 : 100}}万</span>
            </el-form-item>
            <el-form-item label="借款期限">
              <el-input-number placeholder="请输入内容"
                               type='number'
                               :controls='false'
                               v-model="formData.period"
                               :max='9999'
                               class="input-num-withAppend"
                               :disabled='isPreview'>
                <el-select v-model="formData.periodType"
                           slot="append"
                           style='width: 80px'
                           placeholder="请选择">
                  <el-option label="天"
                             value="day"></el-option>
                  <el-option label="个月"
                             value="month"></el-option>
                </el-select>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </cc-panel>

      <cc-panel title='相关证明图片'>
        <list-img-uploader v-for='item,index in imgFileList'
                           @update='updateOtherFile'
                           :propItem='item'
                           :fileList='item.list'
                           :isPreview='isPreview'
                           :key='"imgFileList" + index'>
        </list-img-uploader>

        <list-img-uploader v-for='item,index in otherFileList'
                           @update='updateFile'
                           :propItem='item'
                           :fileList='item.list'
                           :isPreview='isPreview'
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
                     @click="submitForm">保存
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import ListImgUploader from '../userManage/component/ListImgUploader'

  export default {
    name: 'ObInfoEdit',
    components: {
      ListImgUploader
    },

    data() {
      return {
        id: '',
        isPreview: false,
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

        assetInfo: {},
        bidBusinessTypeOptions: [],
        productTypeOptions: [],
        borrowerPersonalList: [],
        borrowerEnterpriseList: [],

        loadingPersonal: false,
        loadingEnterprise: false,

        imgFileList: [],
        otherFileList: [{
          title: '其他',
          desc: '其他信息',
          list: [],
          id: 3306021992, // 默认otherId，前端暂时自定义了
          required: false,
        }],
      }
    },

    created() {
      this.id = this.$route.params && this.$route.params.id
      this.isPreview = this.$route.query && !!this.$route.query.isPreview
      this.isPlatform = this.$route.query && !!this.$route.query.isPlatform

      if (this.id && this.id != 'add') {
        this.getUserInfo()
        this.topTitle = '编辑'
      }
      if (this.isPreview) {
        this.topTitle = '查看'
      }
      if (this.id == 'add') {
        this.topTitle = '新增'
      }

      this.getAssetInfo()
      this.getAssetBidBusinessType()
      this.getBorrowerPersonalList()
      this.getBorrowerEnterpriselList()
    },

    methods: {
      // 获取资产方公司详情
      getAssetInfo() {
        AXIOS.post('/auth/platformMerchantAsset/getAssetByToken').then(res => {
          this.assetInfo = res || {}
        })
      },

      // 获取资产方公司业务类型
      getAssetBidBusinessType() {
        AXIOS.post('/auth/bidBusinessType/getOptionsByMerchantAssetId').then(res => {
          this.bidBusinessTypeOptions = res || []
          if (this.id && this.id == 'add'){
            this.getBidInit()
          }
        })
      },

      getProductType(str) {
        const self = this
        if (str != 'yes') {
          self.formData.productTypeId = ''
        }
        AXIOS.post('/auth/bidProductType/getProductTypeOptionsByMerchantAssetAndBusinessType', {
          id: self.formData.businessTypeId
        }).then(res => {
          self.productTypeOptions = res || []
          if (str != 'yes') {
            self.getBidInit()
          }
        })
      },

      changeBorrowerType() {
        this.formData.borrowerId = ''
        this.formData.amount = ''
        this.getBidInit()
      },

      getBorrowerPersonalList() {
        AXIOS.post('/auth/platformBorrowerPersonal/getOptionsByMerchantAssetId').then(res => {
          this.borrowerPersonalList = res || []
        })
      },
      getBorrowerEnterpriselList() {
        AXIOS.post('/auth/platformBorrowerEnterprise/getOptionsByMerchantAssetId').then(res => {
          this.borrowerEnterpriseList = res || []
        })
      },

      getBidInit() {
        const self = this
        if (this.formData.borrowerType
          && this.formData.businessTypeId
          && this.formData.productTypeId) {
          AXIOS.post('/auth/assetBid/createInit', {
            attachBelong: this.formData.borrowerType,
            businessTypeId: this.formData.businessTypeId,
            productTypeId: this.formData.productTypeId
          }).then(res => {
            self.formatToImgList(res)
          })
        } else {
          self.$set(self, 'imgFileList', [])
        }
      },

      formatToImgList(res) {
        this.formData.bidConfigId = res[0].bidConfigId

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
        let apiUrl = '/auth/assetBid/view'
        AXIOS.post(apiUrl, {
          id
        }).then(res => {
          self.formData = res.assetBidBo || {}
          self.setImgFileList(res.bidConfigAttachmentAttachBos || [])
          self.setOtherFileList(res.otherAttachmentPos || [])
          self.getProductType('yes')
        })
      },

      setImgFileList(arr){
        const self = this
        let tempArr = []
        arr.map((item, index) => {
          let tempItem = {}
          tempItem.list = item.assetBidAttachmentPos || []
          let bidConfigAttachmentPo = item.bidConfigAttachmentPo || {}
          tempItem.title = bidConfigAttachmentPo.attachName
          tempItem.desc = bidConfigAttachmentPo.attachDesc
          tempItem.required = bidConfigAttachmentPo.requireFlag
          tempItem.id = bidConfigAttachmentPo.id
          tempArr.push(tempItem)
        })

        this.$set(this, 'imgFileList', tempArr)
      },

      setOtherFileList(arr){
        const self = this
        let tempOhter = [{
          title: '其他',
          desc: '其他信息',
          list: arr|| [],
          id: 3306021992, // 默认otherId，前端暂时自定义了
          required: false,
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

      updateOtherFile(id, list){
        this.otherFileList.map((item, index) => {
          if (item.id == id) {
            item.list = list
          }
        })
      },

      validForm() {
        let flag = true
        let formData = this.formData
        if (!formData.businessTypeId) {
          this.$message.error('请选择业务类型')
          flag = false
        }
        if (!formData.productTypeId) {
          this.$message.error('请选择产品类型')
          flag = false
        }
        if (!formData.offlineApplyTime) {
          this.$message.error('请选择线下申请时间')
          flag = false
        }
        if (!formData.borrowerId) {
          this.$message.error('请选择借款人')
          flag = false
        }
        if (!formData.amount) {
          this.$message.error('请输入借款金额')
          flag = false
        }
        if (!formData.period) {
          this.$message.error('请输入借款期限')
          flag = false
        }

        const imgFileList = this.imgFileList
        imgFileList.map((item, index) => {
          if (item.required && !isLongArr(item.list)) {
            this.$message.error(item.title + '的图片必须上传！')
            flag = false
          }
        })

        return flag
      },

      submitForm: _.debounce(function(formName) {
        const self = this
        console.log(this.imgFileList)

        let tempArr = []
        this.imgFileList.map((item) => {
          if (isLongArr(item.list)) {
            item.list.map((item2) => {
              item2.bidConfigAttachmentId = item.id
              tempArr.push(item2)
            })
          }
        })
        let otherArr = []
        this.otherFileList.map((item) => {
          if (isLongArr(item.list)) {
            item.list.map((item2) => {
              otherArr.push(item2)
            })
          }
        })

        if (this.validForm()) {
          let tempId = this.formData.borrowerId
          let type = this.formData.borrowerType

          if (type == 'personal') {
            this.borrowerPersonalList.map((item) => {
              if (item.id == tempId) {
                this.formData.borrowerName = item.trueName
              }
            })
          } else {
            this.borrowerEnterpriseList.map((item) => {
              if (item.id == tempId) {
                this.formData.borrowerName = item.name
              }
            })
          }

          let apiUrl = '/auth/assetBid/create'
          let tip = '新增成功'
          if (this.id && this.id != 'add') {
            apiUrl = '/auth/assetBid/edit'
            tip = '修改成功'
          }

          AXIOS.post(apiUrl, {
            assetBidAttachmentPos: tempArr,
            otherAttachmentPos: otherArr,
            assetBidPo: this.formData
          }).then(res => {
            self.$message.success(tip)
            self.closeCurrentTab()
          })
        }
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
