<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="userForm" :rules="rules" ref="userForm" label-width="65px">

      <sticky :className="'sub-navbar '+userForm.status">
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
            <template v-if="type==='0'">
              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="用户名:" prop="username">

                <el-input placeholder="请输入用户名，不超过10个字符" v-model="userForm.username"></el-input>
                <span v-show="userForm.username.length>=30" class='title-prompt'>标题长度超过30个字符时提示</span>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="邮箱:" prop="email">
                <el-input placeholder="请输入邮箱" v-model="userForm.email">
                </el-input>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="密码:" prop="password">
                <el-input :type="passwordTypes[0]" placeholder="请输入密码，不超过10个字符" v-model="userForm.password">
                </el-input>
                <span class="show-pwd" @click="showPwd(0)">
                    <svg-icon icon-class="eye" />
                  </span>
                <span v-show="userForm.password.length>=10" class='title-prompt'>长度超过10个字符时提示</span>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="确认密码:" prop="confirmPassword">
                <el-input :type="passwordTypes[1]" placeholder="再次输入密码，不超过10个字符" v-model="userForm.confirmPassword">
                </el-input>
                <span class="show-pwd" @click="showPwd(1)">
                    <svg-icon icon-class="eye" />
                  </span>
                <span v-show="userForm.confirmPassword.length>=10" class='title-prompt'>长度超过10个字符时提示</span>
              </el-form-item>
            </template>

            <template v-else-if="type==='1'">
              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="原密码:" prop="oldPassword">
                <el-input :type="passwordTypes[0]" placeholder="请输入原密码，不超过10个字符" v-model="userForm.oldPassword">
                </el-input>
                <span class="show-pwd" @click="showPwd(0)">
                    <svg-icon icon-class="eye" />
                  </span>
                <span v-show="userForm.oldPassword.length>=10" class='title-prompt'>长度超过10个字符时提示</span>
              </el-form-item>

              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="新密码:" prop="password">
                <el-input :type="passwordTypes[1]" placeholder="请输入新密码，不超过10个字符" v-model="userForm.password">
                </el-input>
                <span class="show-pwd" @click="showPwd(1)">
                    <svg-icon icon-class="eye" />
                  </span>
                <span v-show="userForm.password.length>=10" class='title-prompt'>长度超过10个字符时提示</span>
              </el-form-item>
              <el-form-item  label-width="100px" style="margin-bottom: 40px;" label="确认密码:" prop="confirmPassword">
                <el-input :type="passwordTypes[2]" placeholder="请再次输入新密码，不超过10个字符" v-model="userForm.confirmPassword">
                </el-input>
                <span class="show-pwd" @click="showPwd(2)">
                    <svg-icon icon-class="eye" />
                  </span>
                <span v-show="userForm.confirmPassword.length>=10" class='title-prompt'>长度超过10个字符时提示</span>
              </el-form-item>
            </template>

            <template v-else-if="type==='2'">
              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="邮箱:" prop="email">
                <el-input placeholder="请输入邮箱，不超过10个字符" v-model="userForm.email" style="float: left">
                </el-input>
              </el-form-item>
            </template>

            <!-- 编辑角色 -->
            <template v-if="type==='3'">
              <el-form-item label-width="100px" style="margin-bottom: 40px;" label="角色:" prop="roles">
                <el-select v-model="roles" multiple filterable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template else>
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
import { fetchEmail, saveUser, updateEmail, resetPassword, fetchAssignedRoles, updateRoles } from '@/api/user.js'
import { fetchRoleList } from '@/api/role_permission'
import { userSearch } from '@/api/remoteSearch'
import { validateEmail } from '@/utils/validate'

// 用户详情默认字段
const defaultForm = {
  // 用户mingc
  username: '',
  // 密码
  password: '',
  confirmPassword: '',
  oldPassword: '',
  // 邮箱
  email: ''
}

export default {
  name: 'userDetail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    type: {
      type: String,
      default: undefined
    },
    detailId: {
      type: String,
      default: undefined
    }
  },
  data() {
    // 字段校验 - 必填
    const validateRequire = (rule, value, callback) => {
      // if (this.type==='2' && this.detailId) {
      //   callback()
      // }
      if (!value.length) {
        callback(new Error(rule.field + '为必填项'))
      } else {
        callback()
      }
    }

    // 字段校验 - URL
    const validateConfirmPassword = (rule, value, callback) => {
      // if (this.isEdit && this.detailId) {
      //   callback()
      // }
      if (value) {
        console.log(rule.field)
        if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback(new Error(rule.field + '为必填项'))
      }
    }

    // 密码校验
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }

    const validEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }

    return {
      passwordTypes: ['password', 'password', 'password'],
      // 角色选项
      options: [],
      // 已分配角色
      roles: [],
      // 页面表单数据集
      userForm: Object.assign({}, defaultForm),
      fetchSuccess: true,
      loading: false,
      rules: {
        username: [
          { required: true, validator: validateRequire, trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', validator: validateConfirmPassword },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, trigger: 'blur', validator: validatePassword },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, trigger: 'blur', validator: validEmail }]
      }
    }
  },
  computed: {
    // 返回摘要内容长度
    contentShortLength() {
      return this.userForm.content_short.length
    }
  },
  created() {
    // 判断是否是编辑态并且传入id
    if (this.type === '2' && this.detailId) {
      this.fetchData(this.detailId)
    } else if (this.type === '3' && this.detailId) {
      this.fetchOptions(this.detailId)
    } else {
      this.userForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    showPwd(id) {
      if (this.passwordTypes[id] === 'password') {
        this.passwordTypes.splice(id, 1, '')
      } else {
        this.passwordTypes.splice(id, 1, 'password')
      }
    },
    // 编辑状态时，获取数据
    fetchData(query) {
      if (this.type === '2') {
        fetchEmail(query).then(response => {
          this.userForm.email = response.data.email
        }).catch(err => {
          this.fetchSuccess = false
          console.log(err)
        })
      }
    },
    fetchOptions(query) {
      fetchRoleList().then(response => {
        this.options = response.data
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
      fetchAssignedRoles(query).then(response => {
        this.roles = response.data
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    // 提交数据-发布上线
    submitForm() {
      // 表单校验
      this.$refs.userForm.validate(valid => {
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
      if (this.type === '0') {
        saveUser(this.userForm).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '用户保存成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['userForm'].resetFields()
            this.$router.push({ path: '/user/index' })
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
      } else if (this.type === '1') {
        resetPassword(Object.assign({ id: this.detailId }, this.userForm)).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '邮箱修改成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['userForm'].resetFields()
            this.$router.push({ path: '/user/index' })
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
      } else if (this.type === '2') {
        updateEmail({ id: this.detailId, email: this.userForm.email }).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '邮箱修改成功',
              type: 'success',
              duration: 2000
            })
            this.$refs['userForm'].resetFields()
            this.$router.push({ path: '/user/index' })
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
      } else if (this.type === '3') {
        // 修改角色
        updateRoles(this.detailId, this.roles).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '角色修改成功',
              type: 'success',
              duration: 2000
            })
            this.roles = []
            this.$router.push({ path: '/user/index' })
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
      }
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
    // 获取用户
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) {
          this.userLIstOptions = []
        } else {
          this.userLIstOptions = response.data.items.map(v => ({
            key: v.name
          }))
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
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
</style>
