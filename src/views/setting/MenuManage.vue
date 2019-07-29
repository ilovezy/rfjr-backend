<template>
  <div class="app-container">
    <h1>后台菜单管理</h1>

    <div class='main-table-wrap'>
      <el-tabs v-model="currentTarget"
               @tab-click="loadData">
        <el-tab-pane label="platform(id: 1)"
                     value='platform'
                     name="platform"></el-tab-pane>

        <!--<el-tab-pane label="merchant(id: 2)"-->
                     <!--value='merchant'-->
                     <!--name="merchant"></el-tab-pane>-->
      </el-tabs>

      <el-row :gutter='50'>
        <el-col :span='12'
                v-permission='["platform:authority:menu:index"]'
                style='max-height: 700px; overflow-y: scroll;'
                v-loading='loading'>
          <el-tree
            :data="data"
            node-key="id"
            ref="tree"
            default-expand-all
            @node-click='nodeClick'
            :expand-on-click-node='false'
            :props="defaultProps">
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span class='text-primary'>id: {{data.id}}</span>
            <span class='text-danger'
                  style='margin-left: 10px;'
                  v-if='data.status=="disabled"'>禁用</span>
          </span>
          </el-tree>
        </el-col>
        <el-col :span='12'>
          <div style='margin-bottom: 20px;'>
            <el-button @click="resetNewMenu"
                       v-permission='["platform:authority:menu:create"]'>增加菜单
            </el-button>

            <el-button @click="editMenu"
                       v-if='formData.id'
                       v-permission='["platform:authority:menu:edit"]'
                       type='warning'>修改菜单
            </el-button>

            <el-button @click="addMenu"
                       v-else
                       v-permission='["platform:authority:menu:create"]'
                       type='primary'>保存新菜单
            </el-button>

            <el-button @click="deleteMenu"
                       v-if='formData.id'
                       v-permission='["platform:authority:menu:delete"]'
                       type='danger'>删除菜单
            </el-button>
          </div>
          <el-form label-position="left"
                   :model="formData"
                   ref="ruleForm"
                   :rules='rules'
                   status-icon
                   label-width="180px">
            <el-form-item label="id"
                          prop="id">
              <el-input v-model="formData.id"
                        disabled></el-input>
            </el-form-item>
            <el-form-item label="href"
                          prop="href">
              <el-input v-model="formData.href"></el-input>
            </el-form-item>

            <el-form-item label="icon"
                          prop='icon'>
              <el-input v-model="formData.icon"></el-input>
            </el-form-item>
            <el-form-item label="name"
                          prop='name'>
              <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="type"
                          prop='type'>
              <el-radio-group v-model="formData.type">
                <el-radio label="menu">menu</el-radio>
                <el-radio label="page">page</el-radio>
                <el-radio label="action">action</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="parentId"
                          prop='parentId'>
              <el-input-number v-model="formData.parentId"
                               :disabled='disableParent'
                               :min='0'
                               controls-position="right"></el-input-number>
            </el-form-item>

            <el-form-item label="permission"
                          prop='permission'>
              <el-input v-model="formData.permission"></el-input>
            </el-form-item>

            <el-form-item label="sort"
                          prop='sort'>
              <el-input-number v-model="formData.sort"
                               :min='0'
                               controls-position="right"></el-input-number>
            </el-form-item>

            <el-form-item label="status"
                          prop='status'>
              <el-radio-group v-model="formData.status">
                <el-radio label="enable">enable</el-radio>
                <el-radio label="disabled">disabled</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="target"
                          prop='target'>
              {{currentTarget}}
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import AXIOS from '../../global/Fetch'

  export default {
    name: '',
    data() {
      return {
        loading: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        data: [],

        formData: {
          type: 'menu',
          parentId: 0,
          sort: 0,
          status: 'enable'
        },
        rules: {
          name: [
            {required: true, message: '菜单名称', trigger: 'blur'}
          ],
          permission: [{
            required: true, message: '请输入权限', trigger: 'blur'
          }]
        },

        disableParent: false,
        currentTarget: 'platform'
      }
    },

    created() {
      this.loadData()
    },

    methods: {
      nodeClick(item) {
        const id = item.id
        AXIOS.post('/a/menu/view', {
          id
        }).then(res => {
          this.formData = res
          this.disableParent = true
          this.clearValidate()
        })
      },

      clearValidate() {
        this.$refs['ruleForm'].clearValidate()
      },

      resetNewMenu() {
        this.disableParent = false
        this.formData = {
          type: 'menu',
          parentId: 1,
          sort: 0,
          status: 'enable'
        }
        this.clearValidate()
      },

      validForm() {
        let flag = true
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        return flag
      },

      addMenu() {
        this.formData.target = this.currentTarget
        if (this.validForm()) {
          AXIOS.post('/a/menu/create', this.formData).then(res => {
            this.loadData()
            this.$message.success('菜单添加成功')
          }).catch()
        }
      },

      deleteMenu() {
        const id = this.formData.id
        if (id) {
          this.$confirm('确定要删除该菜单？', {
            type: 'warning'
          }).then(() => {
            AXIOS.post('/a/menu/delete', {
              id
            }).then(res => {
              this.$message.success('删除成功!')
              this.loadData()
              this.resetNewMenu()
            })
          })
        } else {
          this.$message.error('请选择菜单')
        }
      },

      editMenu() {
        AXIOS.post('/a/menu/edit', this.formData).then(res => {
          this.$message.success('修改成功!')
          this.loadData()
        }).catch()
      },

      loadData() {
        this.loading = true
        AXIOS.post('/a/menu/allMenuTree/platform', {
          target: this.currentTarget
        }).then(res => {
          this.data = isLongArr(res.menuTree) ? res.menuTree : []
          this.resetNewMenu()
          this.loading = false
        }).catch()
      }
    }
  }
</script>

<style scoped>
</style>


