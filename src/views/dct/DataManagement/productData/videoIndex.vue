<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">

      <el-row style="margin-top: 20px">
        <!-- 搜索按钮 -->
        <label style="font-size: 0.9em;color: #606266;margin-left: 40px">GMV日期：</label>
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


        <label style="font-size: 0.9em;color: #606266;margin-left: 40px"> 视频上传日期：</label>
        <el-date-picker
            style="margin-left: 5px"
            v-model="listQuery.postTime"
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

        <el-button   v-waves class="filter-item" type="danger" @click="handleDownload"
                     style="margin-left: 1%;background-color: purple">导出查询数据
        </el-button>
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
        max-height="600px"
        :summary-method="getSummaries"
        show-summary
        highlight-current-row
        style="min-width: 100%"
        @selection-change="handleSelectionChange"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" width=55>
      </el-table-column>

      <el-table-column v-if="showId" :label="$t('table.identification')" width=200 align="center">
        <template slot-scope="scope">
          <span class="link-type" >{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :min-width="calculateWidth" align="center" label="时间" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="排名" sortable prop="index">
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="VID" prop="vid">
        <template slot-scope="scope">
          <span>{{ scope.row.vid }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="总播放量" sortable prop="video_views">
        <template slot-scope="scope">
          <span>{{ scope.row.video_views }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="GMV" sortable  prop="gmv">
        <template slot-scope="scope">
          <span>{{ scope.row.gmv }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="视频链接" prop="url">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>


    </el-table>




  </div>
</template>


<script>
// 数据接口
import {fetchVideoList } from '@/api/dct'
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
    },
    time: {
      type: String,
      default: undefined
    },
    postTime: {
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
        pid:'',
        creator:'',
        time: [],
        postTime:[],
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
      rotueTime: '',
      rotuePostTime: '',
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
        {label: '英国', value: 'gb'}
      ],
      // 是否显示主键的列
      showId: false,
      // 是否正在导出
      downloadLoading: false
    }
  },
  filters: {},
  created() {
    this.creator = this.$route.query.creator
    this.pid = this.$route.query.pid
    this.rotueTime = this.$route.query.time
    this.rotuePostTime = this.$route.query.postTime
    if(this.rotueTime != undefined && this.rotueTime.indexOf(",") >= 0) {
      this.listQuery.time.push(this.rotueTime.split(",")[0])
      this.listQuery.time.push(this.rotueTime.split(",")[1])
    }
    if(this.rotuePostTime != undefined && this.rotuePostTime.indexOf(",") >= 0) {
      this.listQuery.postTime.push(this.rotuePostTime.split(",")[0])
      this.listQuery.postTime.push(this.rotuePostTime.split(",")[1])
    }
    if (this.$route.query && Object.getOwnPropertyNames(this.$route.query).length > 1) {
      this.listQuery = this.$route.query
    }
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
      this.listLoading = false
      debugger
      this.listQuery.pid = this.pid
      this.listQuery.creator = this.creator
      if(this.listQuery.time !== undefined && this.listQuery.time.length > 0 && this.listQuery.time.indexOf(",") > 0){
        let  queryTime = this.listQuery.time
        this.listQuery.time = []
        this.listQuery.time.push(queryTime.split(",")[0])
        this.listQuery.time.push(queryTime.split(",")[1])
      }

      if(this.listQuery.postTime !== undefined && this.listQuery.postTime.length > 0 && this.listQuery.postTime.indexOf(",") > 0){
        let  queryTime = this.listQuery.postTime
        this.listQuery.postTime = []
        this.listQuery.postTime.push(queryTime.split(",")[0])
        this.listQuery.postTime.push(queryTime.split(",")[1])
      }
      fetchVideoList(this.listQuery).then(response => {
        debugger
        this.listLoading = false
        this.list = response.data
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
    handleCountry(str){
      if(str == 'us'){
        return '美国'
      }else {
        return  '英国'
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
      this.getList()
    },


    getSummaries(param) {
      const {columns, data} = param
      const sums = []
      if (!data || data.length === 0) {
        return sums
      }
      const dataProperties = Object.getOwnPropertyNames(data[0])
      const sumsModel = {}
      dataProperties.forEach((property, index) => {
        if (property == 'creator' || property == 'vid' || property == 'index' || property ==  'url')  {
          return '———'
        }
        // 字符转为数据
        const values = data.map(item => Number(item[property]))
        // 遍历数据
        if (!values.every(value => isNaN(value))) {
          sumsModel[property] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sumsModel[property] = '——'
        }
      })
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if(column.property == 'index' || column.property == 'vid' || column.property == 'url'){
          sums[index] == '--'
        }
        debugger
        if (dataProperties.indexOf(column.property) >= 0 && (column.property == 'gmv' ||column.property == 'commission' || column.property == 'order_commission' || column.property == 'partner_commission')){
          sums[index] = parseFloat(sumsModel[column.property]).toFixed(2)
        } else if(column.property == 'date') {
          sums[index] = this.list.length
        }else {
          sums[index] = sumsModel[column.property]
        }
      })
      this.summaryInfo = []
      this.summaryInfo = sums
      return sums
    },

    // 处理选择框改变时
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    calculateWidth(){
      let width = parseFloat(100/10).toFixed(2) + "%"
      return width
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 设置导出列
        const filterVal = ['date','index','vid', 'gmv','video_views','url']
        // 设置对应数据
        const tHeader = ['时间','排名','VID', 'GMV', '视频数量','视频链接']
        var list = []
        this.list.forEach((item, index) => {
          list.push(item)
        })
        var sumInfo = new Object();
        filterVal.forEach((itemInfo, index) => {
          sumInfo[itemInfo] = this.summaryInfo[index]
        })
        list.push(sumInfo)
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '视频数据报表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if(j.indexOf("country") > 0){
          return this.handleCountry(v[j])
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
