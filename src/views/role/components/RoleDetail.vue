<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="role" :rules="rules" ref="role" label-width="65px">

      <sticky :className="'sub-navbar '">
        <template v-if="fetchSuccess">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">保存</el-button>
        </template>
        <template v-else>
          <el-tag style="z-index: 100;color: #ff4d51;font-size: 1em;">发送异常错误,刷新页面,或者联系开发人员</el-tag>
        </template>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="10">
            <template>
              <el-form-item v-show="false" style="margin-bottom: 40px;" prop="id">
                <el-input type="hidden" v-model="role.id"></el-input>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="角色:" prop="roleName">
                <el-input placeholder="请输入角色名称，不超过50个字符" v-model="role.roleName"></el-input>
                <span v-show="role.roleName.length>=50" class='title-prompt'>标题长度超过50个字符时提示</span>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="备注:" prop="remark">
                <el-input placeholder="请输入备注" v-model="role.remark"></el-input>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="permission-tree-container">
      <div class="role-permission-tree">
        <!-- 权限树图 -->
        <el-tree :data="treeData" node-key="id" ref="tree" show-checkbox default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick">
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage4'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchRole, saveRole, fetchPermissionList } from '@/api/role_permission.js'

// 角色详情默认字段
const defaultForm = {
  id: '',
  // 角色名
  roleName: '',
  // 备注
  remark: ''
}

export default {
  name: 'roleDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    type: {
      type: String,
      default: undefined
    }
  },
  data() {
    // 字段校验 - 必填
    const validateRequire = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error(rule.field + '为必填项'))
      } else {
        callback()
      }
    }
    return {
      // 数据集
      treeData: [],
      // 页面表单数据集
      role: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      rules: {
        roleName: [
          { required: true, validator: validateRequire, trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    const detailId = this.$route.params && this.$route.params.id
    // 判断是否是编辑态并且传入id
    if (this.type === '1' && detailId) {
      this.fetchData(detailId)
    } else {
      this.role = Object.assign({}, defaultForm)
    }
    fetchPermissionList(this.listQuery).then(response => {
      // 处理树状图数据
      this.treeData = response.data
    }).catch(() => {})
  },
  methods: {
    // 编辑状态时，获取数据
    fetchData(query) {
      if (this.type === '1') {
        fetchRole(query).then(response => {
          this.role = response.data.info
          // 获取已经设置的资源后渲染
          this.$refs.tree.setCheckedKeys(response.data.chosen)
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      }
    },
    // 提交数据-发布上线
    submitForm() {
      // 表单校验
      this.$refs.role.validate(valid => {
        if (valid) {
          this.loading = true
          // 发起请求
          this.postData()
        } else {
          console.log('表单校验不通过!')
          return false
        }
      })
    },
    // 数据提交操作
    postData() {
      saveRole(this.role, this.$refs.tree.getCheckedKeys()).then(response => {
        this.loading = false
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: this.type === '0' ? '角色保存成功' : '角色修改成功',
            type: 'success',
            duration: 2000
          })
          this.$refs['role'].resetFields()
          this.$refs.tree.setCheckedKeys([])
          this.$router.push({ path: '/role/index' })
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'error',
            duration: 2000
          })
          this.$refs.tree.setCheckedKeys([])
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    closeCurrent() {
      const tag = this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.active]
      this.$store.dispatch('delVisitedViews', tag).then((views) => {
        if (tag.path === this.$route.path || tag.name === this.$route.name) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push({ path: latestView.path, query: latestView.query })
            this.$store.state.tagsView.active = this.$store.state.tagsView.visitedViews.length - 1
          } else {
            this.$router.push('/')
            this.$store.state.tagsView.active = 0
          }
        }
      })
    },
    handleNodeClick(data) {
      console.log('node' + data)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../styles/mixin.scss";
  .title-prompt{
    position: absolute;
    right: 0px;
    top: 40px;
    line-height: 1;
    font-size: 12px;
    color:#ff4949;
  }
  .createPost-container {
    position: relative;
    .createPost-main-container {
      padding: 40px 45px 20px 50px;
      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;
        .postInfo-container-item {
          float: left;
        }
      }
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
  .permission-tree-container{
    padding: 0 50px 0 50px;
  }
</style>
