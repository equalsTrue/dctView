<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>

        <el-select v-model="listQuery.creator" style="margin-left: 20px" multiple collapse-tags  filterable clearable reserve-keyword placeholder="Handle">
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


        <el-select v-model="listQuery.user" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="管理人">
          <el-option
              v-for="item in userList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.userGroup" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="组别">
          <el-option
              v-for="item in userGroupList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>

        <el-select v-model="listQuery.region" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="国家">
          <el-option
              v-for="item in regionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>



        <el-select v-model="listQuery.status" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="状态">
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
        <label style="font-size: 0.9em;color: #606266;margin-left: 40px">请选择日期：</label>
        <el-date-picker
            style="margin-left: 5px"
            v-model="listQuery.time"
            type="datetimerange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            :picker-options="pickerOptions"
        >
        </el-date-picker>


        <el-button v-if="!listLoading" v-waves class="filter-item" type="info" icon="el-icon-search" style="margin-left: 2%"
                   @click="handleFilter">{{ $t('table.search') }}
        </el-button>

        <el-button v-if="!listLoading" v-waves class="filter-item" type="success" icon="el-icon-search" style="margin-left: 1%"
                   @click="handleFilterByDay">按天查询
        </el-button>

        <el-button  v-waves class="filter-item" type="warning" @click="chooseSubmitFiles()" style="margin-left: 1%">
          选取上传文件
        </el-button>


        <el-button v-waves class="filter-item" style="margin-left: 1%;" type="primary" @click="submitUpload">上传到服务器
        </el-button>

        <el-button   v-waves class="filter-item" type="danger" @click="downLoadDetailExcel"
                    style="margin-left: 1%;background-color: purple">导出查询数据
        </el-button>

        <!-- 添加按钮 -->

      </el-row>


    </div>


    <el-dialog
        title="选择上传报表"
        :visible.sync="dialogFileVisible"
        width="70%">

      <el-form style="margin-left: 10px;" v-for="(item,index) of submitList" :model="item"
               label-width="65px">

        <el-card class="box-card" style="padding-top: 20px;padding-bottom: 10px;">
          <el-row>
            <el-col :span="4" style="margin-left: 1%">

              <el-form-item label="选择GMV文件:" label-width="150px">
                <input type="file" id="fileId" ref="fileId" title @change="upLoadGmvFile($event,index)"/>

              </el-form-item>
            </el-col>

            <el-col :span="4" style="margin-left: 200px ">
              <el-form-item label="选择VID文件:" label-width="150px">
                <input type="file" id="fileId" ref="fileId" title @change="upLoadVidFile($event,index)"/>
              </el-form-item>
            </el-col>



          </el-row>

          <el-row>
            <el-col :span="4" style="margin-left: 1%">
              <el-form-item label="选择PID文件:" label-width="150px">
                <input type="file" id="fileId" ref="fileId" title @change="upLoadPidFile($event,index)"/>
              </el-form-item>
            </el-col>

            <el-col :span="4" style="margin-left: 200px">
              <el-form-item label="选择Creator文件:" label-width="150px">
                <input type="file" id="fileId" ref="fileId" title @change="upLoadCreatorFile($event,index)"/>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>

            <el-col :span="4">
              <el-form-item label-width="150px" prop="appName"
                            label="请选择账号:">
                <!--              <label style="font-size: 0.9em;color: #606266;margin-left: 40px">请选择上传平台：</label>-->
                <el-select v-model="item.account" filterable clearable placeholder="account"
                           style="width: 155px">
                  <el-option v-for="item in accountList"
                             :key="item"
                             :label="item"
                             :value="item">
                    <span style="float: left">{{ item }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="4" style="margin-left: 190px">
              <el-form-item label-width="80px" prop="date"
                            label="报表日期:">
                <!--              <label style="font-size: 0.9em;color: #606266;margin-left: 40px">请选择上传平台：</label>-->
                <div class="block">
                  <el-date-picker
                      style="width: 150px;"
                      v-model="item.time"
                      align="right"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      :picker-options="submitPickerOptions">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-button type="primary" icon="el-icon-plus" circle style="margin-left: 110px" size="medium"
                         @click="addSubmitList()"></el-button>

              <el-button v-if="submitList.length > 1" type="danger" icon="el-icon-minus" circle
                         style="margin-left: 55px"
                         size="medium" @click="deleteSubmitList(item)"></el-button>
            </el-col>

          </el-row>


        </el-card>


      </el-form>


      <el-button @click="dialogFileVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogFileVisible = false">确 定</el-button>
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
      <el-table-column width=150px align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="index">
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picture" height="50%" width="50%" >
        </template>
      </el-table-column>


      <el-table-column min-width="20px" label="Handle" column-key="creator">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>






      <el-table-column min-width="20px" label="归属人" >
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>

        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="组别">
        <template slot-scope="scope">
          <span>{{ scope.row.userGroup }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="国家">
        <template slot-scope="scope">
          <span>{{ handleCountry(scope.row.country) }}</span>
        </template>
      </el-table-column>




      <el-table-column min-width="30px" label="GMV">
        <template slot-scope="scope">
          <span>{{ scope.row.gmv }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="佣金">
        <template slot-scope="scope">
          <span>{{ scope.row.commission }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="视频数量" column-key="videos">
        <template slot-scope="scope">
          <span>{{ scope.row.videos }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="总播放量">
        <template slot-scope="scope">
          <span>{{ scope.row.video_views }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="新增视频数量">
        <template slot-scope="scope">
          <span>{{ scope.row.addVideos }}</span>
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
import {fetchProductGmvList ,fetchCreatorGmvParams} from '@/api/dct'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import {parseTime} from '@/utils'
import VueRouter from 'vue-router'
import clip from '@/utils/clipboard'
import moment from 'moment'
import axios from 'axios'

const defaultSubmit = {
  time: '',
  account: '',
  vidFile: null,
  gmvFile: null,
  pidFile: null,
  creatorFile: null
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
      // 表格的key，改变后表格会重新渲染
      tableKey: 0,
      chooseMetricsList:[],
      chooseGroupList:[],
      // 列表数据集
      list: null,
      operator:'',
      // 列表数据总计
      total: null,
      // 列表加载状态
      listLoading: false,
      shopLogList: [],
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        page: 1,
        limit: 10,
        uid:[],
        creator:[],
        status:[],
        user:[],
        region:[],
        userGroup:[],
        time: [
          this.formatDateToday() + ' 00:00:00',
          this.formatDateToday() + ' 23:59:59'
        ]
      },
      dialogFileVisible: false,
      regionList:[],
      dialogLog: false,
      accountLogList:[],
      dateRange: [
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7, 0, 0, 0),
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)
      ],
      submitPickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
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
      // 选项框加载状态
      loading: false,
      submitList:[],
      accountList:['starp','vista'],
      // 列表头部的筛选条件
      statusList: [
        {label: '正常', value: 0},
        {label: '封号', value: 1},
        {label: '弃用', value: 2}
      ],
      groupList:[],
      // 列表头部的筛选条件
      uidList: [],
      userList:[],
      creatorList:[],
      userGroupList:[],
      countryList:[
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
  },
  methods: {
    // 初始化选择框
    initSelector() {
      // 获取参数
      fetchCreatorGmvParams().then(response => {
        this.userList = response.data.user
        this.creatorList = response.data.creator
        this.userGroupList = response.data.userGroup
      }).catch(err => {
        console.log(err)
      })
    },


    upLoadGmvFile(e, index) {
      debugger
      var file = e.target.files[0];
      var form = {};
      form = new FormData();
      form.append('file', file);
      this.submitList[index].gmvFile = file
    },

    upLoadVidFile(e, index) {
      debugger
      var file = e.target.files[0];
      var form = {};
      form = new FormData();
      form.append('file', file);
      this.submitList[index].vidFile = file
    },

    upLoadPidFile(e, index) {
      debugger
      var file = e.target.files[0];
      var form = {};
      form = new FormData();
      form.append('file', file);
      this.submitList[index].pidFile = file


    },

    upLoadCreatorFile(e, index) {
      debugger
      var file = e.target.files[0];
      var form = {};
      form = new FormData();
      form.append('file', file);
      this.submitList[index].createFile = file


    },


    addSubmitList() {
      const submitReport = Object.assign({}, defaultSubmit)
      this.submitList.push(submitReport)
    },
    deleteSubmitList(item) {
      debugger
      const index = this.submitList.indexOf(item)
      if (index !== -1) {
        this.submitList.splice(index, 1);
      }
    },

    chooseSubmitFiles() {
      this.dialogFileVisible = true
      if (this.submitList.length == 0) {
        const submitReport = Object.assign({}, defaultSubmit)
        this.submitList.push(submitReport)
      }
    },
    paresDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCanceledit (row) {
      row.status = false
    },
    // 获取列表数据
    getList() {
      if (this.$store.state.tagsView.visitedViews.length > 0) {
        const index = this.$store.state.tagsView.active
        this.$store.state.tagsView.visitedViews[index].query = Object.assign({}, this.listQuery)
      }
      this.listLoading = false
      if (this.isToday) {
        this.listQuery.begin = moment().utcOffset(0).format('YYYY-MM-DD')
        this.listQuery.end = moment().utcOffset(0).format('YYYY-MM-DD')
      } else {
        this.listQuery.begin = moment(this.dateRange[0]).format('YYYY-MM-DD')
        this.listQuery.end = moment(this.dateRange[1]).format('YYYY-MM-DD')
      }
      this.chooseMetricsList = ['createTime','profilePicture','creator','belong_person','userGroup','country','gmv','videos','video_views','addVideos']
      let params = {pageFilterVo: this.listQuery, pageMetricsVo: this.chooseMetricsList, pageGroupVo: this.chooseGroupList, pageVO: {limit: this.limit, page: this.page, sortColumn: this.sortColumn, sortType: this.sortType}}
      fetchProductGmvList(params).then(response => {
        this.total = response.data.total
        this.listLoading = false
        this.list = response.data.list
      }).catch(() => {
      })
    },

    formatDateToday() {
      let date = new Date();
      let seperator = "-";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = year + seperator + month + seperator + strDate;
      return currentdate;
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    handleCountry(str){
      if(str == 'us'){
        return '美国'
      }else {
        return  '英国'
      }
    },
    closeVisible(type,row){

      if(type === 'belongPerson'){
        row.inputUserVisible = false
      }
      if(type === 'status'){
        row.inputStatusVisible = false
      }
    },
    handleStatus(status){
      let str
      switch (status){
        case 0:
          str = '正常'
          break;
        case 1:
          str = '封号'
              break;
        case 2:
          str = '弃用'
              break;
      }
      return str
    },
    handleCellDoubleClick(row, column, cell, event) {
      if(column.columnKey === 'creator'){
        this.$router.push({path: '/dct/DataManagement/accountData/creatorIndex?creator=' + row.creator})
      }
      if(column.columnKey=== 'videos') {
        this.$router.push({path: '/dct/DataManagement/accountData/videoIndex?pid=' + row.pid})
      }
    },
    checkInOperator(operator){
      if(this.operator.indexOf(operator) > -1 || this.operator.indexOf('all') > -1){
        return  true
      }else {
        return false
      }
    },

    submitUpload() {
      let list = this.submitList;
      const formData = new FormData();
      debugger
      for (let i = 0; i < list.length; i++) {
        const fn = new File([], 'null')
        formData.append('gmvFile', this.submitList[i].gmvFile == null ? fn : this.submitList[i].gmvFile)
        formData.append('vidFile', this.submitList[i].vidFile == null ? fn : this.submitList[i].vidFile)
        formData.append('pidFile', this.submitList[i].pidFile == null ? fn : this.submitList[i].pidFile)
        formData.append('creatorFile', this.submitList[i].creatorFile == null ? fn : this.submitList[i].creatorFile)
        formData.append("account", list[i].account);
        formData.append("times", list[i].time);
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
    },
    // 修改筛选添加后重新加载列表数据
    handleFilter() {
      this.listQuery.page = 1
      this.chooseGroupList = ['creator']
      this.getList()
    },
    handleFilterByDay(){
      this.listQuery.page = 1
      this.chooseGroupList = ['day','creator']
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
    uploadUrl() {
      let url = process.env.VUE_APP_DCT_API
      if (window.location.href.indexOf('sandbox') > 0) {
        url = process.env.VUE_APP_TEST_DCT_API
      } else {
        url = process.env.VUE_APP_DCT_API
      }
      return url + '/dct/gmv/file/submit'
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 设置导出列
        const filterVal = ['createTime', 'creator', 'uid', 'belongPerson', 'userGroup', 'country', 'status', 'deliverTime','closeTime']
        // 设置对应数据
        const tHeader = ['时间', 'Handle', 'UID', '归属人', '组别', '国家', '状态', '交付日期','封号日期']
        const filterList = []
        this.list.forEach((item, index) => {
          filterList.push(item)
        })
        const data = this.formatJson(filterVal, filterList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '账号报表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        debugger
        if (j === 'createTime' || j === 'deliverTime' || j === 'closeTime') {
          if(v[j] != null){
            return parseTime(v[j])
          }
        } else if(j === 'status'){
          return this.handleStatus(v[j])
        }else {
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
