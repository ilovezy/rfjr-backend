<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class='main-table-wrap'>
          <h2>/auth/yeePay/query/bindCardList</h2>

          <div class='search-control'>
            <el-form :inline="true"
                     class="demo-form-inline">
              <el-form-item label="identityId">
                <el-input v-model="bindCardListQuery.identityId"
                          placeholder="identityId"></el-input>

              </el-form-item>
              <el-button type="primary"
                         @click='doSearch'>查询
              </el-button>
            </el-form>
            <codemirror v-model="listResult" :options="cmOptions"></codemirror>

          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='main-table-wrap'>
          <h2>/auth/yeePay/unbindRequest</h2>

          <div class='search-control'>
            <el-form :inline="true"
                     class="demo-form-inline">

              <el-form-item label="cardTop">
                <el-input v-model="unbindRequestQuery.cardTop"
                          placeholder="cardTop"></el-input>
              </el-form-item>

              <el-form-item label="cardLast">
                <el-input v-model="unbindRequestQuery.cardLast"
                          placeholder="cardLast"></el-input>
              </el-form-item>

              <el-form-item label="identityId">
                <el-input v-model="unbindRequestQuery.identityId"
                          placeholder="identityId"></el-input>
              </el-form-item>
              <el-button type="primary"
                         @click='doSearch2'>查询
              </el-button>
            </el-form>
            <codemirror v-model="unbindRequestResult" :options="cmOptions"></codemirror>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import SingleImgUploader from '@/components/SingleImgUploader'
  // require component
  import { codemirror } from 'vue-codemirror'
  // require styles
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/theme/rubyblue.css'
  // language
  import 'codemirror/mode/javascript/javascript.js'
  // theme css
  import 'codemirror/theme/monokai.css'
  // require active-line.js
  import'codemirror/addon/selection/active-line.js'
  // styleSelectedText
  import'codemirror/addon/selection/mark-selection.js'
  import'codemirror/addon/search/searchcursor.js'
  // hint
  import'codemirror/addon/hint/show-hint.js'
  import'codemirror/addon/hint/show-hint.css'
  import'codemirror/addon/hint/javascript-hint.js'
  import'codemirror/addon/selection/active-line.js'
  // highlightSelectionMatches
  import'codemirror/addon/scroll/annotatescrollbar.js'
  import'codemirror/addon/search/matchesonscrollbar.js'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/match-highlighter.js'
  // keyMap
  import'codemirror/mode/clike/clike.js'
  import'codemirror/addon/edit/matchbrackets.js'
  import'codemirror/addon/comment/comment.js'
  import'codemirror/addon/dialog/dialog.js'
  import'codemirror/addon/dialog/dialog.css'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/search.js'
  import'codemirror/keymap/sublime.js'
  // foldGutter
  import'codemirror/addon/fold/foldgutter.css'
  import'codemirror/addon/fold/brace-fold.js'
  import'codemirror/addon/fold/comment-fold.js'
  import'codemirror/addon/fold/foldcode.js'
  import'codemirror/addon/fold/foldgutter.js'
  import'codemirror/addon/fold/indent-fold.js'
  import'codemirror/addon/fold/markdown-fold.js'
  import'codemirror/addon/fold/xml-fold.js'
  export default {
    components: {
      SingleImgUploader, codemirror
    },
    data() {
      return {
        showPagination: true,
        list: [],
        total: 0,
        listLoading: false,
        bindCardListQuery: {
          identityId: ''
        },
        listResult: '',

        unbindRequestQuery: {
          cardTop: '',
          cardLast: '',
          identityId: ''
        },
        unbindRequestResult: '',

        code: 'const a = 10',
        cmOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: 'text/javascript',
          lineWrapping: true,
          theme: 'default'
        }
      }
    },

    methods: {
      doSearch() {
        AXIOS.post('/auth/yeePay/query/bindCardList', this.bindCardListQuery).then(res => {
          this.listResult = JSON.stringify(res, null, ' ')
        }).catch(res => {
          this.listResult = JSON.stringify(res, null, ' ')
        })
      },
      doSearch2() {
        AXIOS.post('/auth/yeePay/unbindRequest', this.unbindRequestQuery).then(res => {
          this.unbindRequestResult = JSON.stringify(res, null, ' ')
        }).catch(res => {
          this.unbindRequestResult = JSON.stringify(res, null, ' ')
        })
      },

    }
  }
</script>

<style lang="scss"
       scoped>

</style>


