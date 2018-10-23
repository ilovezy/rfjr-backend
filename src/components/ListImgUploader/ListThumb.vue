<template>
  <div class='preview-thumb'>
    <img :src='fileUrl' alt=''>
    <div class='mask'>
            <span class='icon-control el-icon-zoom-in'
                  @click='preview'></span>
      <span class='icon-control el-icon-close'
            v-if='!isPreview'
            @click='remove'
      ></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'listThumb',

    data() {
      return {
        fileUrl: ''
      }
    },

    props: {
      fileKey: {
        type: String,
        default: ''
      },
      index: {
        type: Number,
        default: ''
      },
      isPreview: {
        type:Boolean,
        default: false
      }
    },

    computed: {

    },

    mounted(){
      this.getFileTrueUrl()
    },

    methods: {
      getFileTrueUrl(){
        AXIOS.post('/auth/file/url', {
          fileKey: this.fileKey
        }).then(res => {
          this.fileUrl = res
        })
      },

      preview() {
        this.$emit('handlePreview', this.fileUrl)
      },

      // on-remove
      remove() {
        this.$emit('handleRemove', this.index)
      },
    }
  }
</script>

<style lang='scss'
       scoped>
  .preview-thumb {
    float: left;
    display: inline-block;
    margin-bottom: 15px;
    width: 150px;
    height: 150px;
    border: 1px solid #e2e2e2;
    margin-right: 15px;
    line-height: 150px;
    position: relative;
    overflow: hidden;
    img {
      display: inline-block;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .mask {
      position: relative;
      top: 0;
      left: 0;
      width: 150px;
      height: 150px;
      background: rgba(0,0,0,0.5);
      display: none;
      transition: all 1s ease;
    }
    &:hover {
      .mask{
        //display: block;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
    .icon-control {
      &.el-icon-zoom-in,
      &.el-icon-close{
        //position: absolute;
        //top: 50%;
        //transform: translateY(-50%);
        //z-index: 2;
        color: #fff;
        font-size: 25px;
        left: 35px;
        cursor: pointer;
      }
      &.el-icon-close{
        left: 85px;
      }
    }
  }
</style>
