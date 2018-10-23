<template>
  <div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="auto"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
    <cc-panel :title="propItem.title + (propItem.required ? '（必传）' : '（非必传）')"
              :subTitle='propItem.desc'>
      <div class='preview-img-list'>
        <list-thumb :fileKey='item.fileName'
                    @handlePreview='handlePreview'
                    @handleRemove='handleRemove'
                    :index='index'
                    :isPreview='isPreview'
                    :key='item.fileName + "listThumb" + index'
                    v-for='item, index in fileList'></list-thumb>
      </div>

      <el-upload
        v-if='!isPreview'
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
    </cc-panel>
  </div>

</template>

<script>
  import ListThumb from './ListThumb'

  export default {
    name: 'ListImgUploader',
    components: {
      ListThumb
    },
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        file: {},
        fileNumLimit: 9, // 图片张数
        fileSizeLimit: 10 // 图片大小 10mb
      }
    },

    props: {
      isPreview: {
        type: Boolean,
        default: false
      },
      fileList: {
        type: Array,
        default: {}
      },
      propItem: {
        type: Object,
        default: {}
      }
    },

    mounted() {
      console.log('fuck', this.fileList)
    },
    computed: {
      imgUploadUrl() {
        const env = process.env.NODE_ENV
        const ajaxUrl = CONFIG.serviceUrl[env]
        return ajaxUrl + 'auth/file/upload' // TODO 替换掉地址
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
      uploadSuccess(res, file, fileList) {
        const self = this
        const result = res.result
        if (result) {
          AXIOS.post('/auth/file/url', {
            fileKey: result
          }).then(res => {
            if (self.fileList.length < self.fileNumLimit) {
              self.fileList.push({
                fileUrl: res,
                fileName: result
              })

              self.$emit('update', self.propItem.id, self.fileList)
            } else {
              this.$message.error('最多上传' + self.fileNumLimit + '张图片')
            }
          })
        } else {
          this.$message.error('图片上传失败')
        }
      },

      handlePreview(fileUrl) {
        this.dialogImageUrl = fileUrl
        this.dialogVisible = true
      },

      // on-remove TODO
      handleRemove(index) {
        const self = this
        this.fileList.splice(index, 1)
        this.$emit('update', self.propItem.id, self.fileList)
        console.log('fuck', this.fileList)
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
        const sizeValid = file.size / 1024 / 1024 < this.fileSizeLimit

        if (!typeValid) {
          this.$message.error('上传图片只能是 jpg,jpeg,png 格式!')
        }
        if (!sizeValid) {
          this.$message.error('上传图片大小不能超过 10MB!')
        }
        return typeValid && sizeValid
      }
    }
  }
</script>

<style lang='scss'
       scoped>
  @import "ListImgUploader";
</style>
