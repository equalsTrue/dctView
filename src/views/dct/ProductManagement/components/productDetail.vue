<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="formData" :rules="rules" ref="formData" label-width="65px">

      <sticky :className="'sub-navbar '+formData.status">
        <template v-if="fetchSuccess">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm()">保存
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
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="商品名称:" prop="productName">
                  <el-input
                    placeholder="请输产品名称"
                    v-model="formData.productName"
                    clearable>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="商品图片:" prop="picture">
                  <el-upload
                    ref="submitPictureRef"
                    :on-change="checkPictureList"
                    :limit="1"
                    :action="submitPictureUrl"
                    :on-remove="handleRemove"
                    :file-list="picture"
                    list-type="picture-card"
                    :auto-upload="false">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>


            </el-row>

            <el-row>

              <el-col :span="7">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="PID:" prop="pid">
                  <el-input class="rt-input" v-model="formData.pid"  style="">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label-width="100px" style="margin-bottom: 40px;margin-left: 20%" label="数量:" prop="count">
                  <el-input-number placeholder="请输入数量" v-model="formData.count" >
                  </el-input-number>
                </el-form-item>
              </el-col>

            </el-row>

            <el-row>
              <el-col :span="7">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="颜色:" prop="color">
                  <el-input class="rt-input" v-model="formData.color"  style="">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="100px" style="margin-bottom: 40px;margin-left: 17%" label="区域:" prop="region">
                  <el-input class="rt-input" v-model="formData.region"  style="">
                  </el-input>
                </el-form-item>
              </el-col>


            </el-row>

            <el-row>


              <el-col :span="7">

                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="管理人:" prop="manager">
                  <el-select v-model="formData.manager" filterable clearable placeholder="请选择管理人" >
                    <el-option
                        v-for="item in users"
                        :key="item"
                        :label="item"
                        :value="item">
                      <span style="float: left">{{ item }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>

              </el-col>

              <el-col :span="12">
                <el-form-item label-width="100px" style="margin-bottom: 40px;margin-left: 17%" label="存放地点:" prop="location">
                  <el-input class="rt-input" v-model="formData.storeLocation"  style="">
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
import {fetchProduct, saveProduct, fetchProductParams } from '@/api/dct'
import moment from "moment";
import axios from 'axios'

// zoo offer 详情默认字段
const defaultForm = {
  pid: '',
  region: '',
  storeLocation: '',
  count: 0,
  id: '',
  productName: '',
  manager: ''
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
    },
    isRestock: {
      type: Boolean,
      default: false
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

    const validateNumberRequire = (rule, value, callback) => {
      if (value != null) {
        const reg = /^(0|[1-9][0-9]*)(\.\d+)?$/
        if (!reg.test(value)) {
          callback(new Error(rule.field + '为必填项'))
        } else {
          if (value < 0) {
            callback(new Error(rule.field + '为必填项'))
          } else {
            callback()
          }
        }
      } else {
        if (value == 0) {
          callback()
        } else {
          callback(new Error(rule.field + '为必填项'))
        }
      }
    }

    return {
      // 页面表单数据集
      formData: Object.assign({}, defaultForm),
      beforeCommodityData: Object.assign({}, defaultForm),
      localPageUser: '',
      users:[],
      fetchSuccess: true,
      loading: false,
      submitPictureUrl: '',
      picture: [],
      rules: {
        productName: [
          {required: true, validator: validateRequire, trigger: 'blur'},
        ],
        count: [
          {required: true, validator: validateNumberRequire, trigger: 'blur'}
        ],
        color: [
          {required: true, validator: validateRequire, trigger: 'blur'}
        ],
        pid: [
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
      this.fetchParams()
      this.generatePictureUrl(this.formData.pid )
    }
  },
  methods: {
    fetchParams(){
      fetchProductParams().then( response =>{
          this.users = response.data.user
      })
    },
    generatePictureUrl(pid){
      debugger
      this.submitPictureUrl = process.env.VUE_APP_DCT_API + '/dct/product/submit/' + pid + '/productPicture'
      if (window.location.href.indexOf('sandbox.new') > 0) {
        this.submitPictureUrl = process.env.VUE_APP_DCT_API + '/dct/product/submit/' + pid  + '/productPicture'
      }
    },



    handleRemove() {
      this.$refs.submitPictureRef.$el.children[0].style.display = 'none'
      this.$refs.submitPictureRef.$el.children[1].style.display = 'block'
    },
    handlePreview(file) {
    },

    checkPictureList() {
      this.$refs.submitPictureRef.$el.children[0].style.display = 'block'
      this.$refs.submitPictureRef.$el.children[1].style.display = 'none'
    },
    fetchData(query) {
      fetchProduct(query).then(response => {
        this.formData = response.data
        this.generatePictureUrl(this.formData.pid)
        if(response.data.picture !== '' && response.data.picture != null){
          this.picture = [{name: this.formData.pid + '.png', url: response.data.picture}]
          this.$refs.submitPictureRef.$el.children[0].style.display = 'block'
          this.$refs.submitPictureRef.$el.children[1].style.display = 'none'
        }
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
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
      // 补货不用上传照片
      if (this.isRestock) {
        this.formData.picture = []
      }
      saveProduct(this.formData).then(response => {
        this.loading = false
        if (response.code === 200) {
          let methodName = ''
          if (!this.isEdit) {
            methodName = 'add'
          } else {
            methodName = 'update'
          }
          this.generatePictureUrl(this.formData.pid)
          this.submitPictureToS3()
          this.$notify({
            title: '成功',
            message: this.isEdit ? '修改成功' : '保存成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/dct/ProductManagement/index'})
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
    submitPictureToS3() {
      event.preventDefault();
      this.$refs.submitPictureRef.action = this.submitPictureUrl
      this.$refs.submitPictureRef.submit()
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
