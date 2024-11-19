<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>

        <el-select v-model="listQuery.creator" style="margin-left: 20px" multiple filterable clearable reserve-keyword placeholder="Handle">
          <el-option
              v-for="item in creatorList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
          </el-option>
        </el-select>

        <el-select v-model="listQuery.uid" style="margin-left: 20px" multiple filterable clearable reserve-keyword placeholder="UID">
          <el-option
              v-for="item in uidList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.country" style="margin-left: 20px" multiple filterable clearable reserve-keyword placeholder="国家">
          <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>



        <el-select v-model="listQuery.assignStatus" style="margin-left: 20px" multiple filterable clearable reserve-keyword placeholder="分配状态">
          <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>


      </el-row>

      <el-row style="margin-top: 20px">
        <!-- 搜索按钮 -->



        <el-button v-if="!listLoading" v-waves class="filter-item" type="info" icon="el-icon-search" style="margin-left: 5%"
                   @click="handleFilter">{{ $t('table.search') }}
        </el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
        <!-- 添加按钮 -->
        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                   @click="handleToAdd">{{ $t('table.add') }}
        </el-button>


        <!-- 表格导出 -->
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="success" icon="el-icon-download"
                   @click="handleImport">导入文件
        </el-button>


        <el-button v-if="checkInOperator('submit')" v-waves class="filter-item" style="margin-left: 10px;" type="warning" @click="submitUpload">上传到服务器
        </el-button>

        <el-checkbox v-model="showId" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">显示主键
        </el-checkbox>
      </el-row>


    </div>


    <el-dialog
        title="选择上传报表"
        :visible.sync="dialogVisible"
        width="70%">

      <el-form style="margin-left: 10px;" v-for="(item,index) of submitList" :model="item"
               label-width="65px">

        <el-card class="box-card" style="padding-top: 20px;padding-bottom: 10px;">
          <el-row>
            <el-col :span="4">

              <el-form-item label="选择账号文件:" label-width="150px">
                <input type="file" id="fileId" ref="fileId" title @change="upLoadAccountFile($event,index)"/>

              </el-form-item>
            </el-col>



          </el-row>

          <el-row>

            <!--            <el-col :span="8">-->
            <!--              <el-button type="primary" icon="el-icon-plus" circle style="margin-left: 110px" size="medium"-->
            <!--                         @click="addSubmitList()"></el-button>-->

            <!--              <el-button v-if="submitList.length > 1" type="danger" icon="el-icon-minus" circle-->
            <!--                         style="margin-left: 55px"-->
            <!--                         size="medium" @click="deleteSubmitList(item)"></el-button>-->
            <!--            </el-col>-->

          </el-row>


        </el-card>


      </el-form>


      <el-button @click="dialogVisible = false" style="margin-left: 5%">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false" style="margin-left: 1%">确 定</el-button>
    </el-dialog>


    <!-- 表格 -->
    <el-table
        :key='tableKey'
        :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        style="min-width: 100%"
        @selection-change="handleSelectionChange"
        @cell-dblclick="handleCellDoubleClick"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" width=55>
      </el-table-column>

      <el-table-column v-if="showId" :label="$t('table.identification')" width=200 align="center">
        <template slot-scope="scope">
          <span class="link-type" >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width=150px align="center" :label="$t('table.date')" sortable prop="createTime">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="Handle">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>



      <el-table-column min-width="20px" label="UID">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="国家">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputCountryVisible">{{ handleCountry(scope.row.country)  }}</span>
          <div v-if="scope.row.inputCountryVisible" style="width: 30px">
            <el-dialog
                title="更新国家"
                :visible.sync="scope.row.inputCountryVisible"
                width="30%">

              <el-select v-model="scope.row.country" filterable clearable placeholder="请选择国家">
                <el-option
                    v-for="item in countryList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>


              <el-button type="primary" style="margin-left: 5%" plain size="mini" :key="scope.row.id + '-Status-selector-confirm'" @click="handleUpdateCountry(scope.row,'country')">{{$t('table.confirm')}}</el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'" @click="scope.row.inputCountryVisible = false">{{$t('table.cancel')}}</el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="账号类型">
        <template slot-scope="scope">
          <span>{{ scope.row.account_type }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="类目">
        <template slot-scope="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="状态" column-key="status">
        <template slot-scope="scope">
          <span>{{ scope.row.assignStatus == 0 || scope.row.assignStatus == null  ? '可分配' : '已分配' }}</span>
        </template>
      </el-table-column>



      <el-table-column min-width="20px" label="分配归属人" column-key="belongPerson">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputUserVisible">{{ scope.row.belongPerson }}</span>
          <div v-if="scope.row.inputUserVisible" style="width: 30px">
            <el-dialog
                title="更新归属人"
                :visible.sync="scope.row.inputUserVisible"
                width="30%">

              <el-select v-model="scope.row.belongPerson" filterable clearable placeholder="请选择归属人">
                <el-option
                    v-for="item in userList"
                    :key="item"
                    :label="item"
                    :value="item">
                  <span style="float: left">{{ item }}</span>
                </el-option>
              </el-select>


              <el-button type="primary" style="margin-left: 5%" plain size="mini" :key="scope.row.id + '-Status-selector-confirm'" @click="handleSelectConfirm(scope.row,'user')">{{$t('table.confirm')}}</el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'" @click="scope.row.inputUserVisible = false">{{$t('table.cancel')}}</el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="组别">
        <template slot-scope="scope">
          <span>{{ scope.row.userGroup }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="分配人">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="交付日期">
        <template slot-scope="scope">
          <span>{{ scope.row.deliverTime }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.notes }}</span>
        </template>
      </el-table-column>

    </el-table>

    <!-- 页码 -->
    <div class="pagination-container">
      <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

  </div>
</template>


<script>
// 数据接口
import {fetchAccountList, fetchAccountParams,assignAccount,updateAccount} from '@/api/dct'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import {parseTime} from '@/utils'
import VueRouter from 'vue-router'
import clip from '@/utils/clipboard'
import moment from 'moment'
import axios from 'axios'

const defaultSubmit = {
  accountFile: null
}
export default {
  name: 'Account',
  directives: {
    waves
  },
  data() {
    return {
      isToday: false,
      tagTypes: [
        '',
        'primary',
        'success',
        'info',
        'warning',
        'danger'
      ],
      dialogVisible: false,
      // 表格的key，改变后表格会重新渲染
      tableKey: 0,
      // 列表数据集
      list: null,
      operator: '',
      // 列表数据总计
      total: null,
      // 列表加载状态
      listLoading: false,
      shopLogList: [],
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        page: 1,
        limit: 10,
        uid: '',
        creator: [],
        assignStatus: [],
        belongPerson: [],
        country: [],
        userGroup: [],
      },
      dialogCommodityLog: false,
      dateRange: [
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7, 0, 0, 0),
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime())
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime())
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime())
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      localPageUser:'',
      // 选项框加载状态
      loading: false,
      // 列表头部的筛选条件
      statusList: [
        {label: '可分配', value: 0},
        {label: '已分配', value: 1}
      ],
      submitList: [],
      // 列表头部的筛选条件
      uidList: [],
      userList: [],
      creatorList: [],
      userGroupList: [],
      countryList: [
        {label: '美国', value: 'us'},
        {label: '英国', value: 'uk'}
      ],
      // 是否显示主键的列
      showId: false,
      // 是否正在导出
      downloadLoading: false
    }
  },
  filters: {},
  created() {
    // if (this.$route.query && Object.getOwnPropertyNames(this.$route.query).length > 1) {
    //   this.listQuery = this.$route.query
    // }
    this.initSelector()
    this.getList()
    this.localPageUser = this.$store.getters.name

  },
  methods: {
    // 初始化选择框
    initSelector() {
      // 获取参数
      fetchAccountParams().then(response => {
        this.userList = response.data.belongPerson
        this.uidList = response.data.uid
        this.creatorList = response.data.creator
        this.userGroupList = response.data.userGroup
      }).catch(err => {
        console.log(err)
      })
      this.operator = this.$route.meta.operator
      this.operator = 'all'
    },
    paresDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取列表数据
    getList() {
      if (this.$store.state.tagsView.visitedViews.length > 0) {
        const index = this.$store.state.tagsView.active
        this.$store.state.tagsView.visitedViews[index].query = Object.assign({}, this.listQuery)
      }
      this.listLoading = true
      if (this.isToday) {
        this.listQuery.begin = moment().utcOffset(0).format('YYYY-MM-DD')
        this.listQuery.end = moment().utcOffset(0).format('YYYY-MM-DD')
      } else {
        this.listQuery.begin = moment(this.dateRange[0]).format('YYYY-MM-DD')
        this.listQuery.end = moment(this.dateRange[1]).format('YYYY-MM-DD')
      }
      fetchAccountList(this.listQuery).then(response => {
        this.total = response.data.total
        this.listLoading = false
        const tableList = []
        for (const row of response.data.list) {
          row.inputStatusVisible = false
          row.inputUserVisible = false
          row.inputCountryVisible = false
          tableList.push(row)
        }
        this.list = tableList
      }).catch(() => {
      })
    },

    handleCountry(str){
      if(str == 'us'){
        return '美国'
      }else {
        return  '英国'
      }
    },
    addSubmitList() {
      const submitReport = Object.assign({}, defaultSubmit)
      this.submitList.push(submitReport)
    },
    deleteSubmitList(item) {
      const index = this.submitList.indexOf(item)
      if (index !== -1) {
        this.submitList.splice(index, 1);
      }
    },
    handleUpdateCountry(row) {
      let params = {uid: row.uid, country: row.country}
      updateAccount(params).then(response => {
        if (response.data.code == 200) {
        }
        this.$message.success('更新成功')
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    upLoadAccountFile(e, index) {
      debugger
      var file = e.target.files[0];
      this.fileName = file.name;
      this.fileSize = file.size;
      var form = {};
      form = new FormData();
      form.append('file', file);
      // this.facebookFileList.splice(index,1,file)
      this.submitList[index].accountFile = file
    },
    handleSelectConfirm(row, type) {
      let params = {uid: row.uid, belongPerson: row.belongPerson, country: row.country}
      const that = this
      let alert = '是否修改'
      that.$confirm(alert, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        assignAccount(params).then(response => {
          if (response.code === 200) {
            that.$notify({
              title: '成功',
              message: '分配成功',
              type: 'success',
              duration: 2000
            })
            this.closeVisible(type, row)
            that.getList()
          }
        }).catch(err => {
          console.log(err)
        })
      })
      row.inputVisible = false
    },

    uploadUrl() {
      let submitUrl = this.getAccountSubmitUrl()
      return submitUrl
    },

    getAccountSubmitUrl() {
      let url = process.env.VUE_APP_DCT_API
      if (window.location.href.indexOf('sandbox') > 0) {
        url = process.env.VUE_APP_TEST_DCT_API
      } else {
        url = process.env.VUE_APP_DCT_API
      }
      return url + '/dct/account/import'
    },

    submitUpload() {
      let list = this.submitList;
      const formData = new FormData();
      for (let i = 0; i < list.length; i++) {
        const fn = new File([], 'null')
        formData.append('accountFile', this.submitList[i].accountFile == null ? fn : this.submitList[i].accountFile)
        formData.append('manager',this.localPageUser)
      }
      let url = this.uploadUrl()
      axios({
        url: url,
        method: 'post',
        processData: false,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }).then((data) => {
        console.log(data)
      }).catch((error) => {
        console.log(error)
      });
      this.uploading = false;
      this.getList()
    },

    closeVisible(type, row) {

      if (type === 'belongPerson') {
        row.inputUserVisible = false
      }
      if (type === 'status') {
        row.inputStream = false
      }
    },
    handleImport() {
      this.dialogVisible = true
      if (this.submitList.length == 0) {
        const submitReport = Object.assign({}, defaultSubmit)
        this.submitList.push(submitReport)
      }
    },
    handleStatus(status) {
      let str
      switch (status) {
        case 0:
          str = '已分配'
          break;
        case 1:
          str = '未分配'
          break;
      }
      return str
    },
    handleCellDoubleClick(row, column, cell, event) {

      if (column.columnKey === 'belongPerson') {
        row.inputUserVisible = true
      }
    },
    checkInOperator(operator) {
      if (this.operator.indexOf(operator) > -1 || this.operator.indexOf('all') > -1) {
        return true
      } else {
        return false
      }
    },
    // 修改筛选添加后重新加载列表数据
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 页码修改后重新加载
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    // 页码修改后重新加载
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 处理选择框改变时
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 前往添加页面
    handleToAdd() {
      this.$router.push({path: '/dct/AccountManagement/add'})
    },
    handleDownload() {
      let params = {
        pageFilterVo: this.listQuery,
        pageMetricsVo: this.chooseMetricsList,
        pageGroupVo: this.chooseGroupList,
      }

      // 先设置下载状态为加载中
      this.downloadLoading = true

      // 发起异步请求获取导出数据
      exportGmvList(params, this.user).then(response => {
        // 获取从接口返回的列表数据
        let exportGmvList = response.data.pageVO.list;

        // 设置导出列
        const filterVal = ['date', 'index', 'profile_picture', 'creator', 'belong_person', 'userGroup', 'country', 'gmv', 'creator_commission', 'partner_commission', 'videos', 'video_views', 'addViews'];

        // 设置对应的数据表头
        const tHeader = ['时间', '排名', '头像', 'Handle', '归属人', '组别', '国家', 'GMV', 'creator佣金', 'partner佣金', '视频数量', '视频总播放量', '新增视频数量'];

        // 处理导出数据
        var list = []
        exportGmvList.forEach(item => {
          list.push(item)
        })

        // 汇总信息
        var sumInfo = new Object();
        filterVal.forEach((itemInfo, index) => {
          sumInfo[itemInfo] = this.summaryInfo[index]
        })
        // 添加汇总数据
        list.push(sumInfo)

        // 格式化数据
        const data = this.formatJson(filterVal, list)

        // 导出 Excel 文件
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '账号数据报表'
          })
          // 下载完成后设置加载状态为 false
          this.downloadLoading = false
        })
      }).catch(() => {
        // 请求失败时的处理
        this.downloadLoading = false
      })
    },

    formatJson(filterVal, jsonData) {
      // 格式化数据，将每一行数据按照 filterVal 映射为正确的列
      return jsonData.map(v => filterVal.map(j => {
        if (j.indexOf("country") > 0) {
          return this.handleCountry(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style>
.cell .el-tag {
  margin-right: 0.5em;
}

.filter-container .filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 0px;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
