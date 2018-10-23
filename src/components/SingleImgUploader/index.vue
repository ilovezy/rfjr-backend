<template>
  <div>
    <el-dialog :visible.sync="dialogVisible"
               append-to-body>
      <img width="auto"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
    <list-thumb v-if='file'
                :fileKey='file'
                :isSingleImg='isSingleImg'
                @handlePreview='handlePreview'
                @handleRemove='handleRemove'
                :isPreview='isPreview'></list-thumb>
    <el-upload
      v-if='!isPreview && !file'
      v-cloak
      class='spe-upload'
      :action="imgUploadUrl"
      :headers='uploadHeader'
      multiple
      :size="9"
      :on-success='uploadSuccess'
      :on-error='uploadError'
      :before-upload="beforeAvatarUpload"
      :show-file-list="false">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>

</template>

<script>
  import ListThumb from './ListThumb'

  export default {
    name: 'SingleImgUploader',
    components: {
      ListThumb
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      }
    },

    props: {
      isPreview: {
        type: Boolean,
        default: false
      },
      file: {
        type: String,
        default: {}
      },
      uploadUrl: {
        type: String,
        default: ''
      },
      isSingleImg: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      imgUploadUrl() {
        const env = process.env.NODE_ENV
        const ajaxUrl = CONFIG.serviceUrl[env]
        return ajaxUrl + (this.uploadUrl || 'auth/file/upload') // TODO 替换掉地址
      },
      uploadHeader() {
        const token = USER.getToken()
        return {
          Version: '1.0',
          Authorization: 'Bearer ' + token
        }
      }
    },

    methods: {
      uploadSuccess(res, file) {
        const self = this
        const result = res.result
        if (result) {
          if (self.isSingleImg) {
            self.$emit('update', result)
          } else {
            AXIOS.post('/auth/file/url', {
              fileKey: result
            }).then(res => {
              self.$emit('update', result)
            })
          }
        } else {
          this.$message.error('图片上传失败')
        }
      },

      handlePreview(fileUrl) {
        this.dialogImageUrl = fileUrl
        this.dialogVisible = true
      },

      handleRemove() {
        this.$emit('update', '')
      },

      uploadError(err, file, fileList) {
        this.$message({
          type: 'error',
          message: '图片上传失败'
        })
      },

      beforeAvatarUpload(file) {
        const fileTypeLimit = ['image/jpeg', 'image/jpg', 'image/png']
        const typeValid = fileTypeLimit.indexOf(file.type) > -1
        if (!typeValid) {
          this.$message.error('上传图片只能是 jpg,jpeg,png 格式!')
        }
        return typeValid
      }
    }
  }
</script>

<style lang='scss'
       scoped>
</style>
