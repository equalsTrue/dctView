<template>
  <div class="components-container" style="padding:30px 150px 0 150px;">
    <el-timeline size="large">
      <el-timeline-item timestamp="步骤 1: 上传文件" placement="top">
        <el-card>
          <el-row>
            <el-col :span="8">
              <el-upload
                ref="upload"
                drag
                action="/"
                :http-request="handleImportExcel"
                :on-change='handleAddFile'
                :file-list="fileList"
                :auto-upload="false"
                :limit="1"
                multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传 xlsx/xlc/xlm/xls/xlt/xlw/csv 文件，且不超过500kb<br />
                  (文件列名必须为 mobile, content, from)
                </div>
              </el-upload>
              <el-button v-if="!handledExcel" style="margin-left: 280px;" size="mini" type="primary" @click="submitUpload">确认文件</el-button>
            </el-col>
            <el-col :span="6" style="padding-top: 45px;">
              <el-form class="form-container" :model="tempData" ref="tempForm" label-width="65px">
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="用户号码:" prop="mobile">
                  <el-input placeholder="请输入用户号码" v-model="tempData.mobile"></el-input>
                </el-form-item>
                <el-form-item label-width="100px" style="margin-bottom: 40px;" label="发送内容:" prop="content">
                  <el-input type="textarea" :rows="2" placeholder="请输入发送内容" v-model="tempData.content"></el-input>
                </el-form-item>
                <el-button style="margin-left: 250px;" size="mini" type="primary" @click="handleSingleAdd">确认添加</el-button>
              </el-form>
            </el-col>
            <el-col :span="6" v-show="listLoading">
              <img style="width: auto;height: auto;max-width: 250px;max-height: 250px;" src="https://bit.ly/2WFoq3J">
            </el-col>
          </el-row>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="步骤 2: 选择用户" placement="top">
        <el-card>
          <h4>请选择发送的用户列表</h4>
          <el-row>
            <el-col :span="2">
              <div v-if="list !== null && list.length > 0">
                <el-button v-if="!isSelectAll" @click="toggleSelection" type="primary">全部选择</el-button>
                <el-button v-else @click="toggleSelection" type="primary">取消选择</el-button>
              </div>
            </el-col>
            <el-col :span="2">
              <el-button v-if="deleteList !== null && deleteList.length > 0" @click="backDelete" type="info">撤回删除</el-button>
            </el-col>
          </el-row>
          <el-table
            ref="multipleTable"
            :key='tableKey'
            :data="list"
            v-loading="listLoading"
            element-loading-text="拼命加载中"
            border
            fit
            highlight-current-row
            style="width: 100%"
            min-height="100"
            max-height="500"
            show-file-list
            @selection-change="handleSelectionChange">
            <!-- 选择框 -->
            <el-table-column type="selection" width=55>
            </el-table-column>


            <el-table-column min-width="30px" max-width="50px" label="用户号码(mobile)">
              <template slot-scope="scope">
                <span>{{scope.row.mobile}}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="100px" label="发送内容(content)">
              <template slot-scope="scope">
                <span>{{scope.row.content}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.actions')" width=150 class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="步骤 3: 发送内容（选填）" placement="top">
        <el-card>
          <h4>设置默认内容(所有内容将替换为该文本)</h4>
          <el-input type="textarea" v-model="formData.defaultContent" placeholder="请输入默认发送内容（选填）" :rows="5" style="width: 800px;"></el-input>
        </el-card>
      </el-timeline-item>

      <el-timeline-item timestamp="步骤 4: 点击发送" placement="top">
        <el-card>
          <el-button v-loading="loading" v-if="!isSuccess" style="margin-left: 50px;" size="medium" type="success" @click="submitSend">确认发送</el-button>
          <span style="color:#909399;margin-left: 50px;">点击确认发送后，将加入到发送列表中，您可以前往查看发送执行结果。</span>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
import { importExcel } from '@/vendor/ImportExcel'
import { submitSendList } from '@/api/esme/smpp'

const defaultData = {
  list: [],
  defaultContent: ''
}

const defaultTempData = {
  mobile: '',
  content: ''
}

export default {
  name: 'SplitpaneDemo',
  components: { splitPane },
  data() {
    return {
      handledExcel: false,
      files: [],
      list: [],
      isSelectAll: false,
      formData: Object.assign({}, defaultData),
      fileList: [],
      tableKey: 1,
      listLoading: false,
      loading: false,
      isSuccess: false,
      tempArray: [],
      tempData: Object.assign({}, defaultTempData),
      deleteList: []
    }
  },
  methods: {
    handleSingleAdd() {
      if (this.tempData.mobile !== null && this.tempData.mobile !== undefined && this.tempData.mobile.length > 0) {
        const patt = /\d+/
        if (patt.test(this.tempData.mobile)) {
          this.list.push(Object.assign({}, this.tempData))
        } else {
          this.$message.warning('请输入正确的用户号码！')
        }
      }
      this.tempData = Object.assign({}, defaultTempData)
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleAddFile(file) {
      this.files.push(file)
    },
    handleImportExcel(param) {
      this.listLoading = true
      // 处理解析 excel 文件
      console.log('#----处理文件----')
      // 解析文件
      importExcel(this.files[0]).then(tabJson => {
        if (tabJson != null && tabJson instanceof Array && tabJson.length > 0) {
          // xlsxJson就是解析出来的json数据,数据格式如下
          // [
          //   {
          //     sheetName: sheet1
          //     sheet: sheetData
          //   }
          // ]
          this.tempArray = []
          for (const item of tabJson) {
            this.tempArray = this.tempArray.concat(item.sheet)
          }
        }
      })
      param.onSuccess()
      this.handledExcel = true
      setTimeout(() => {
        this.list = this.list.concat(this.tempArray)
        this.listLoading = false
      }, 3000)
    },
    toggleSelection() {
      if (this.list !== null && this.list !== undefined && this.list.length > 0) {
        this.isSelectAll = !this.isSelectAll
        if (this.isSelectAll) {
          this.list.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    // 处理选择框改变时
    handleSelectionChange(val) {
      this.formData.list = val
    },
    handleDelete(row) {
      this.$confirm('是否确认删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.list.indexOf(row)
        const obj = { index: index, row: row }
        this.deleteList.push(obj)
        this.list.splice(index, 1)
        this.formData.list.splice(row)
      }).catch(() => {})
    },
    backDelete() {
      const obj = this.deleteList.pop()
      const row = obj.row
      this.list.splice(obj.index, 0, row)
    },
    submitSend() {
      // 处理发送
      if (this.formData.list === null || this.formData.list === undefined || this.formData.list.length === 0) {
        this.$message.warning('请勾选要发送的用户！')
        return
      } else {
        submitSendList(this.formData).then(response => {
          this.loading = false
          if (response.code === 200) {
            this.isSuccess = true
            this.$notify({
              title: '成功',
              message: '上传成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({ path: '/smpp/record/index' })
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
    }
  }
}
</script>

<style  scoped>
  @import url("//unpkg.com/element-ui@2.7.0/lib/theme-chalk/index.css");
  .components-container {
    position: relative;
    height: 100vh;
  }
  .left-container {
    background-color: #F38181;
    height: 100%;
  }

  .right-container {
    background-color: #FCE38A;
    height: 200px;
  }

  .top-container {
    background-color: #FCE38A;
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    width: 100%;
    background-color: #95E1D3;
    height: 100%;
  }
</style>
<style>
  .el-upload-list {
    width: 365px;
  }
</style>
