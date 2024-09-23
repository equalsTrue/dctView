<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="formData" :rules="rules" ref="formData" label-width="65px">

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
              <el-form-item v-if="detailId" v-show="false" style="margin-bottom: 40px;" prop="id">
                <el-input type="hidden" v-model="formData.id"></el-input>
              </el-form-item>

              <el-form-item v-if="parentId" v-show="false" style="margin-bottom: 40px;" prop="parentId">
                <el-input type="hidden" v-model="formData.parentId"></el-input>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="权限名称:" prop="name">
                <el-input placeholder="请输入权限名称，不超过50个字符" v-model="formData.name"></el-input>
                <span v-if="formData.name" v-show="formData.name.length>=50" class='title-prompt'>标题长度超过50个字符时提示</span>
              </el-form-item>
              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="权限标题:" prop="title">
                <el-input placeholder="请输入权限标题，不超过50个字符" v-model="formData.title"></el-input>
                <span v-if="formData.title" v-show="formData.title.length>=50" class='title-prompt'>标题长度超过50个字符时提示</span>
              </el-form-item>

              <el-form-item  label-width="100px" style="margin-bottom: 40px;" label="操作权限:" prop="operator">
                <el-input placeholder="请输入操作权限" v-model="formData.operator" @change="vailOperator"></el-input>
              </el-form-item>

              <el-form-item v-if="!this.isOperator" label-width="100px" style="margin-bottom: 40px;" label="权限路径:" prop="path">
                <el-input placeholder="请输入权限路径，不超过150个字符" v-model="formData.path"></el-input>
                <span v-if="formData.path" v-show="formData.path.length>=150" class='title-prompt'>标题长度超过150个字符时提示</span>
              </el-form-item>
              <el-form-item v-if="!this.isOperator" label-width="100px" style="margin-bottom: 25px;" label="重定向路径:" prop="redirect">
                <el-input placeholder="需要重定向时请填写重定向路径，例如 '/user/index'" v-model="formData.redirect"></el-input>
                <span v-if="formData.redirect" v-show="formData.redirect.length>=150" class='title-prompt'>标题长度超过150个字符时提示</span>
              </el-form-item>





              <el-form-item label="是否显示:" label-width="100px" style="margin-bottom: 25px;"  v-if="!this.isOperator">
                <el-switch inactive-text="显示" active-text="隐藏"
                           inactive-color="#13ce66" active-color="#ff4949"
                           v-model="formData.hidden" :width=60 ></el-switch>
              </el-form-item>
              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="图标:" prop="icon" v-if="!this.isOperator">
                <el-input placeholder="请输入权限图标，不超过50个字符" v-model="formData.icon"></el-input>
                <span v-if="formData.icon" v-show="formData.icon.length>=50" class='title-prompt'>标题长度超过50个字符时提示</span>
              </el-form-item>

            </template>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage4'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchPermission, savePermission } from '@/api/role_permission.js'

// 权限详情默认字段
const defaultForm = {
  id: '',
  operator:'',
  // 权限名
  name: '',
  parentId: '',
  title: '',
  icon: '',
  path: '',
  redirect: '',
  hidden: false
}

export default {
  name: 'permissionDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    type: {
      type: String,
      default: undefined
    },
    detailId: {
      type: String,
      default: undefined
    },
    parentId: {
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
      // 页面表单数据集
      formData: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      isOperator: false,
      rules: {
        name: [
          { required: true, validator: validateRequire, trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, validator: validateRequire, trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        icon: [
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        path: [
          { min: 1, max: 150, message: '长度在 1 到 150 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    // 判断是否是编辑态并且传入id
    if (this.type === '1' && this.detailId) {
      this.fetchData(this.detailId)
    } else {
      this.formData = Object.assign({}, defaultForm)
      this.formData.parentId = this.parentId
    }
  },
  methods: {
    // 编辑状态时，获取数据
    fetchData(query) {
      if (this.type === '1') {
        fetchPermission(query).then(response => {
          this.formData = response.data
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      }
    },
    vailOperator(){
      if(this.operator !== '' && this.operator !== null){
        this.isOperator = true
        this.formData.hidden = true
      }else {
        this.isOperator = false
      }
    },
    // 提交数据-发布上线
    submitForm() {
      // 表单校验
      this.$refs.formData.validate(valid => {
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
      savePermission(this.formData).then(response => {
        this.loading = false
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: this.type === '0' ? '角色保存成功' : '角色修改成功',
            type: 'success',
            duration: 2000
          })
          this.closeCurrent()
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'error',
            duration: 2000
          })
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
</style>
