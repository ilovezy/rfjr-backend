<template>
  <div class="app-container">
    <h2>{{topTitle}}</h2>
    <el-form label-position="left"
             label-width="120px">
      <cc-panel>
        <el-row :gutter="100">
          <el-col :span="12">
            <el-form-item label="角色名称"
                          prop="角色名称">
              <el-input v-model="formData.name"
                        :disabled='isPreview'></el-input>
            </el-form-item>
            <el-form-item label="目标"
                          prop="目标">
              <el-select v-model="formData.target"
                         placeholder="请选择"
                         @change='changeTarget'
                         :disabled='isPreview || currentStatus == "edit"'>
                <el-option
                  v-for="item,index in targetTypeMap"
                  :key="'targetTypeMap' + index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12' style='max-height: 600px;overflow-y: scroll;'>
            <el-form-item label="菜单">
              <el-tree
                :data="treeData"
                show-checkbox
                node-key="id"
                ref="tree"
                :default-checked-keys="menuIds"
                default-expand-all
                :props="defaultProps">
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </cc-panel>
      <el-row class='text-right'>
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
  import AXIOS from '../../global/Fetch'

  export default {
    name: 'CharacterManageEdit',
    components: {},

    data() {
      return {
        loading: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeData: [],
        targetTypeMap: ENUM.targetTypeMap,
        formData: {
          name: '',
          target: 'platform',
        },
        menuIds: [], // TODO 默认选中父节点的时候，不要让所有子节点都选中
        currentStatus: '',

        topTitle: ''
      }
    },

    created() {
      this.id = this.$route.params && this.$route.params.id

      this.target = this.$route.query && this.$route.query.target
      this.formData.target = (this.$route.query && this.$route.query.target) || 'platform'
      this.isPreview = this.$route.query && !!this.$route.query.isPreview

      if (this.id && this.id == 'add') {
        this.currentStatus = 'add'
        this.topTitle = '新增'
      }

      if (this.id && this.id != 'add') {
        this.loadTreeData(true, this.target)
        this.currentStatus = 'edit'
        this.topTitle = '编辑'
      } else {
        this.loadTreeData()
      }

      if (this.isPreview) {
        this.topTitle = '查看'
      }
    },

    methods: {
      changeTarget() {
        this.loadTreeData()
      },

      getUserInfo() {
        const self = this
        const id = this.id
        AXIOS.post('/a/role/view', {
          id
        }).then(res => {
          self.formData.name = res.name
          self.formData.id = res.id
          const tempMenuIds = _.difference(res.menuIds || [], self.getHasChildrenNodes())
          self.$refs.tree.setCheckedKeys(tempMenuIds)
        })
      },

      loadTreeData(isEdit, target) {
        this.loading = true
        let param = {
          target: target || this.formData.target
        }
        AXIOS.post('/a/menu/allMenuTree/platform', param).then(res => {
          this.treeData = isLongArr(res.menuTree) ? res.menuTree : []
          this.loading = false
          if (isEdit) {
            this.getUserInfo()
          }
        }).catch()
      },

      getHasChildrenNodes() {
        const tempIds = []
        this.treeData.map((item, index) => {
          if (isLongArr(item.children)) {
            tempIds.push(item.id)

            item.children.map((item2, index) => {
              if (isLongArr(item2.children)) {
                tempIds.push(item2.id)
              }
            })
          }
        })
        return tempIds || []
      },

      getSelectKeysAll() {
        const tree = this.$refs.tree
        const allKeys = _.union(tree.getCheckedKeys(), tree.getHalfCheckedKeys())
        return allKeys || []
      },

      validForm() {
        let flag = true
        const formData = this.formData
        if (!formData.name) {
          this.$message.error('请填写用户名')
          flag = false
        }
        if (!formData.target) {
          this.$message.error('请填写用户目标')
          flag = false
        }
        if (!this.getSelectKeysAll().length) {
          this.$message.error('请选择菜单')
          flag = false
        }
        return flag
      },

      submitForm: _.debounce(function (formName) {
        if (this.validForm()) {
          let apiUrl = '/a/role/create'
          let successTip = '角色添加成功'
          if (this.id && this.id != 'add') {
            apiUrl = '/a/role/edit'
            successTip = '角色修改成功'
          }
          let param = this.formData || {}
          param.menuIds = this.getSelectKeysAll() || []
          AXIOS.post(apiUrl, param).then(res => {
            this.$message.success(successTip)
            this.closeCurrentTab()
            this.$router.push('/setting/CharacterManage')
          })
        }
      }, 1000, true)
    }
  }
</script>

<style lang='scss'>
</style>
