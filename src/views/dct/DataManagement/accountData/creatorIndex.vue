<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>

        <el-select v-model="listQuery.product_id" style="margin-left: 20px" multiple collapse-tags  filterable clearable reserve-keyword placeholder="PID">
          <el-option
              v-for="item in pidList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.level_1_category" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="一级类目">
          <el-option
              v-for="item in level_1_categoryList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.level_2_category" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="二级类目">
          <el-option
              v-for="item in level_2_categoryList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.cid" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="CID">
          <el-option
              v-for="item in cidList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
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
      @cell-dblclick="handleCellDoubleClick"
    >
      <!-- 选择框 -->
      <el-table-column type="selection" width=55>
      </el-table-column>
      <el-table-column width=150px align="center" :label="$t('table.date')" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" sortable label="排名" prop="index">
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>




      <el-table-column :min-width="calculateWidth" label="图片" prop="picture">
        <template slot-scope="scope">
          <img :src="scope.row.picture" height="50%" width="50%" >
        </template>
      </el-table-column>




      <el-table-column :min-width="calculateWidth" label="PID" prop="product_id">
        <template slot-scope="scope">
          <span>{{ scope.row.product_id }}</span>

        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="一级类目" prop="level_1_category">
        <template slot-scope="scope">
          <span>{{ scope.row.level_1_category }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="二级类目" prop="level_2_category">
        <template slot-scope="scope">
          <span>{{ scope.row.level_2_category }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" sortable label="销量" prop="orders">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>



      <el-table-column :min-width="calculateWidth" sortable label="GMV" prop="gmv">
        <template slot-scope="scope">
          <span>{{ scope.row.gmv }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" sortable label="视频数量" column-key="videos" prop="videos">
        <template slot-scope="scope">
          <el-link type="primary">{{ scope.row.videos }}</el-link>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" sortable label="总播放量" prop="video_views">
        <template slot-scope="scope">
          <span>{{ scope.row.video_views }}</span>
        </template>
      </el-table-column>


    </el-table>

    <!-- 页码 -->




  </div>
</template>


<script>
// 数据接口
import {fetchPerCreatorList, fetchPidGmvParams} from '@/api/dct'
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
      pidList: [],
      chooseGroupList:[],
      chooseMetricsList:[],
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        creator:[],
        product_id:[],
        level_1_category:[],
        level_2_category:[],
        cid:[],
        time: []
      },
      cidList:[],
      dialogLog: false,
      level_1_categoryList:[],
      level_2_categoryList:[],
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
      rotueTime:'',
      // 选项框加载状态
      loading: false,
      // 列表头部的筛选条件
      statusList: [
        {label: '正常', value: 0},
        {label: '封号', value: 1},
        {label: '弃用', value: 2}
      ],
      groupList:[],
      // 列表头部的筛选条件
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
  props: {
    creator: {
      type: String,
      default: undefined
    },
    time: {
      type: String,
      default: undefined
    }
  },
  filters: {},
  created() {
    this.creator = this.$route.query.creator
    this.rotueTime = this.$route.query.time
    if(this.rotueTime.indexOf(",") >= 0) {
      this.listQuery.time.push(this.rotueTime.split(",")[0])
      this.listQuery.time.push(this.rotueTime.split(",")[1])
    }else {
      this.time = this.$route.query.time
    }

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
      fetchPidGmvParams(this.creator).then(response => {
        this.pidList = response.data.pid
        this.level_1_categoryList = response.data.level_1_category
        this.level_2_categoryList = response.data.level_1_category
        this.cidList = response.data.cid
      }).catch(err => {
        console.log(err)
      })
      this.operator = this.$route.meta.operator
      this.operator = 'all'
    },
    paresDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCanceledit (row) {
      row.status = false
    },

    calculateWidth(){
      let width = parseFloat(100/10).toFixed(2) + "%"
      return width
    },
    // 获取列表数据
    getList() {
      if (this.$store.state.tagsView.visitedViews.length > 0) {
        const index = this.$store.state.tagsView.active
        this.$store.state.tagsView.visitedViews[index].query = Object.assign({}, this.listQuery)
      }
      this.listLoading = false
      this.listQuery.creator = [this.creator]
      this.chooseMetricsList = ['date','product_id','level_1_category','level_2_category','orders','gmv','videos','video_views','country']
      this.chooseGroupList = ['product_id','day','level_1_category','level_2_category','country']
      let params = {pageFilterVo: this.listQuery, pageMetricsVo: this.chooseMetricsList, pageGroupVo: this.chooseGroupList, pageVO: {limit: this.limit, page: this.page, sortColumn: this.sortColumn, sortType: this.sortType}}
      fetchPerCreatorList(params).then(response => {
        debugger
        this.listLoading = false
        this.list = response.data.pageVO.list
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
    handleCellDoubleClick(row, column, cell, event) {
      if(column.columnKey=== 'videos') {
        this.$router.push({path: '/dct/DataManagement/accountData/videoIndex?pid=' + row.product_id  + '&creator=' + this.creator + '&time=' + this.listQuery.time[0] + "," + this.listQuery.time[1]})
      }
    },
    checkInOperator(operator){
      if(this.operator.indexOf(operator) > -1 || this.operator.indexOf('all') > -1){
        return  true
      }else {
        return false
      }
    },

    getSummaries(param) {
      debugger
      const {columns, data} = param
      const sums = []
      if (!data || data.length === 0) {
        return sums
      }
      const dataProperties = Object.getOwnPropertyNames(data[0])
      const sumsModel = {}
      dataProperties.forEach((property, index) => {
        if (property == 'date' || property == 'creator' || property == 'belong_person'
            || property == 'userGroup' || property == 'index' || property ==  'profile_picture' || property == 'country' || property == 'belong_pserson') {
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
        if(column.property == 'date' || column.property == 'index' || column.property == 'product_id'
            || column.property == 'level_1_category' || column.property == 'level_2_category' || column.property == 'picture'){
          sums[index] == '--'
          return;
        }
        if (dataProperties.indexOf(column.property) >= 0 && (column.property == 'gmv' ||column.property == 'commission' || column.property == 'order_commission' || column.property == 'partner_commission')){
          sums[index] = parseFloat(sumsModel[column.property]).toFixed(2)
        }else {
          sums[index] = sumsModel[column.property]
        }
      })
      this.summaryInfo = []
      this.summaryInfo = sums
      return sums
    },

    // 修改筛选添加后重新加载列表数据
    handleFilter() {
      this.getList()
    },

    // 处理选择框改变时
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 前往添加页面


    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 设置导出列
        const filterVal = ['date','index','picture','product_id','level_1_category', 'level_2_category', 'orders', 'gmv', 'videos','video_views']
        // 设置对应数据
        const tHeader = ['时间','排名','图片','PID','一级类目', '二级类目', '销量', 'GMV', '视频数量','视频总播放量']
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
          filename: '单个账号数据报表'
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
