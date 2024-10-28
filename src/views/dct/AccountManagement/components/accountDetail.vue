<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="formData" :rules="rules" ref="formData" label-width="65px">

      <sticky :className="'sub-navbar '+formData.status">
        <template v-if="fetchSuccess">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="postData()">保存
          </el-button>
        </template>
        <template v-else>
          <el-tag style="z-index: 100;color: #ff4d51;font-size: 1em;">发送异常错误,刷新页面,或者联系开发人员</el-tag>
        </template>
      </sticky>

      <div v-if="fetchSuccess" class="createPost-main-container">
        <el-form-item v-if="detailId" v-show="false" style="margin-bottom: 40px;" prop="identification">
          <el-input type="hidden" v-model="formData.id"></el-input>
        </el-form-item>
        <el-row :span="24">
          <el-col :span="11">

            <el-row>

              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="Handle:" prop="creator">
                  <el-input
                      placeholder="请输入Handle"
                      v-model="formData.creator"
                      clearable>
                  </el-input>
                </el-form-item>
              </el-col>


              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="UID:" prop="uid">
                  <el-input
                      placeholder="请输入UID"
                      v-model="formData.uid"
                      clearable>
                  </el-input>
                </el-form-item>
              </el-col>



            </el-row>

            <el-row>

              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="国家:" prop="country">
                  <el-select v-model="formData.country" filterable clearable placeholder="请选择国家" >
                    <el-option
                        v-for="item in countryList"
                        :key="item.label"
                        :label="item.label"
                        :value="item.value">
                      <span style="float: left">{{ item.label}}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!--              <el-form-item label-width="100px" style="margin-left: 10%" label="归属人:" prop="belongPerson">-->
              <!--                <el-select v-model="formData.belongPerson" filterable clearable placeholder="请选择归属人" >-->
              <!--                  <el-option-->
              <!--                      v-for="item in userList"-->
              <!--                      :key="item"-->
              <!--                      :label="item"-->
              <!--                      :value="item">-->
              <!--                    <span style="float: left">{{ item }}</span>-->
              <!--                  </el-option>-->
              <!--                </el-select>-->
              <!--              </el-form-item>-->

            </el-row>
            <el-row>

              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="账号类型:" prop="account_type">
                  <el-input
                      placeholder="请输入账号类型"
                      v-model="formData.account_type"
                      clearable>
                  </el-input>
                </el-form-item>
              </el-col>


              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="类目:" prop="category">
                  <el-input
                      placeholder="请输入类目"
                      v-model="formData.category"
                      clearable>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>

              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="备注:" prop="notes">
                  <el-input
                      placeholder="请输入备注"
                      v-model="formData.notes"
                      clearable>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>



          </el-col>


        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from 'components/Tinymce/index.vue'
import Upload from 'components/Upload/singleImage4.vue'
import MDinput from 'components/MDinput/index.vue'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from 'components/Sticky/index.vue' // 粘性header组件
import {fetchAccount, fetchAccountParams, saveAccount} from '@/api/dct'
import moment from "moment";

// zoo offer 详情默认字段
const defaultForm = {
  uid: '',
  country: '',
  user: '',
  id: '',
  creator: '',
  manager: '',
  // belongPerson: '',
  account_type: '',
  category:'',
  notes: ''
}


export default {
  name: 'productDetail',
  components: {Tinymce, MDinput, Upload, Multiselect, Sticky},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    detailId: {
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
      userList:[],
      countryList: [
        {label: '美国', value: 'us'},
        {label: '英国', value: 'uk'}
      ],
      fetchSuccess: true,
      loading: false,
      localPageUser:'',
      rules: {
        uid: [
          {required: true, validator: validateRequire, trigger: 'blur'},
        ],

        creator: [
          {required: true, validator: validateRequire, trigger: 'blur'}
        ],

        manager: [
          {required: true, validator: validateRequire, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {},
  created() {
    this.localPageUser = this.$store.getters.name
    // 判断是否是编辑态并且传入id
    if (this.isEdit && this.detailId) {
      this.fetchData(this.detailId)
    } else {
      this.formData = Object.assign({}, defaultForm)
    }
    this.initSelector()
  },
  methods: {
    initSelector() {
      // 获取参数
      fetchAccountParams().then(response => {
        this.userList = response.data.belongPerson
        this.uidList = response.data.uid
        this.creatorList = response.data.creatorList
      }).catch(err => {
        console.log(err)
      })
    },

    fetchData(query) {
      fetchAccount(query).then(response => {
        this.formData = response.data
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
    },


    // 提交数据-发布上线
    // 数据提交操作
    postData() {
      this.formData.manager = this.localPageUser
      saveAccount(this.formData).then(response => {
        this.loading = false
        if (response.code === 200) {
          this.$notify({
            title: '成功',
            message: this.isEdit ? '修改成功' : '保存成功',
            type: 'success',
            duration: 2000
          })
          if(this.formData.id !== ''){
            this.$router.push({path: '/dct/AccountManagement/index'})
          }else {
            this.$router.push({path: '/dct/AccountManagement/assignIndex'})
          }
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'error',
            duration: 2000
          })
          this.loading = false
        }
      }).catch((error) => {
        this.loading = false
        console.log(error)
      })
    },

    closeCurrent() {
      const tag = this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.active]
      this.$store.dispatch('delVisitedViews', tag).then((views) => {
        if (tag.path === this.$route.path || tag.name === this.$route.name) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push({path: latestView.path, query: latestView.query})
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
@import "../../../../styles/mixin.scss";

.title-prompt {
  position: absolute;
  right: 0px;
  top: 40px;
  line-height: 1;
  font-size: 12px;
  color: #ff4949;
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
  .rt-input /deep/ .el-input__inner {
    color: black !important;
    cursor: pointer;
  }


  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }

}
</style>
