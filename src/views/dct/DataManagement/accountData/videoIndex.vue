<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">

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


        <el-button v-if="!listLoading" v-waves class="filter-item" type="info" icon="el-icon-search" style="margin-left: 5%"
                   @click="handleFilter">{{ $t('table.search') }}
        </el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
        <!-- 添加按钮 -->

      </el-row>


    </div>

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


      <el-table-column min-width="20px" label="VID">
        <template slot-scope="scope">
          <span>{{ scope.row.vid }}</span>
        </template>
      </el-table-column>






      <el-table-column min-width="30px" label="总播放量">
        <template slot-scope="scope">
          <span>{{ scope.row.video_views }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="GMV">
        <template slot-scope="scope">
          <span>{{ scope.row.gmv }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="视频链接">
        <template slot-scope="scope">
          <span>{{ scope.row.videoUrl }}</span>
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
import {fetchPidVideoList } from '@/api/dct'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import {parseTime} from '@/utils'
import VueRouter from 'vue-router'
import clip from '@/utils/clipboard'
import moment from 'moment'

export default {
  name: 'Account',
  directives: {
    waves
  },
  props: {
    pid: {
      type: String,
      default: undefined
    },
    creator: {
      type: String,
      default: undefined
    }
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
        pid:'',
        creator:'',
        time: [
          this.formatDateToday() + ' 00:00:00',
          this.formatDateToday() + ' 23:59:59'
        ]
      },
      regionList:[],
      dialogLog: false,
      accountLogList:[],
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
      // 选项框加载状态
      loading: false,
      // 列表头部的筛选条件
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
    this.getList()
  },
  methods: {
    // 初始化选择框

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
      this.listLoading = true
      if (this.isToday) {
        this.listQuery.begin = moment().utcOffset(0).format('YYYY-MM-DD')
        this.listQuery.end = moment().utcOffset(0).format('YYYY-MM-DD')
      } else {
        this.listQuery.begin = moment(this.dateRange[0]).format('YYYY-MM-DD')
        this.listQuery.end = moment(this.dateRange[1]).format('YYYY-MM-DD')
      }
      this.listQuery.pid = this.pid
      this.listQuery.creator = this.creator
      fetchPidVideoList(this.listQuery).then(response => {
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
    handleSelectConfirm(row, type) {
      let params
      const that = this
      let alert
      switch (type) {
        case 'status':
          alert = '是否修改状态'
          params = {id: row.id, status: row.status}
          break;
        case  'belongPerson':
          alert = '是否修改归属人'
          params = {id: row.id, belongPerson:row.belongPerson}
          break
        default:
      }
      that.$confirm(alert, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateAccount(params).then(response => {
          if (response.code === 200) {
            that.$notify({
              title: '成功',
              message: '更新成功',
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
    queryLogInfo(){
      queryAccountLog(this.logQuery).then(response =>{
         this.accountLogList = response.data
      })
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
      debugger
      if(column.columnKey === 'status' && this.checkInOperator('update')){
        row.inputStatusVisible = true

      }
      if(column.columnKey=== 'belongPerson' && this.checkInOperator('update')){
        row.inputUserVisible = true
      }
    },
    checkInOperator(operator){
      if(this.operator.indexOf(operator) > -1 || this.operator.indexOf('all') > -1){
        return  true
      }else {
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
    queryLog(){
      this.dialogLog = true
    },
    handleToUpdate(row) {
      this.$router.push({path: '/dct/AccountManagement/update/' + row.id})
    },
    handleToDelete(id){
      const that = this
      that.$confirm( '删除该账号', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAccount(id).then(response => {
          if (response.code === 200) {
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            that.getList()
          }
        }).catch(err => {
          console.log(err)
        })
      })
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
