<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload'
               size="mini"
               :style="{background:color,borderColor:color}"
               @click=" dialogVisible=true"
               type="primary">上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible"
               title='上传图片'
               :append-to-body='true' width='300px'>
      <div style='height: 200px;'>
      <single-img-uploader @update='updateFile'
                           uploadUrl='auth/cmsBanner/uploadBanner'
                           :file='image'
                           :isSingleImg='true'></single-img-uploader>
      </div>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="handleSubmit">确 定
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
  import SingleImgUploader from '@/components/SingleImgUploader'

  export default {
    components: {
      SingleImgUploader,
    },
    name: 'editorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    data() {
      return {
        dialogVisible: false,
        fileList: [],
        image: ''
      }
    },
    methods: {
      updateFile(file){
        this.image = file
      },
      handleSubmit() {
        this.$emit('successCBK', this.image)
        this.image = ''
        this.dialogVisible = false
      },
    }
  }
</script>

<style rel="stylesheet/scss"
       lang="scss"
       scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    /deep/ .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
