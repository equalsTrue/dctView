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

        <el-select v-model="listQuery.country" style="margin-left: 20px" multiple collapse-tags filterable clearable reserve-keyword placeholder="国家">
          <el-option
              v-for="item in countryList"
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


      <el-table-column width=150px align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="排名" sortable>
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.profile_picture" height="50%" width="50%" >
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="Handle" column-key="creator">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>






      <el-table-column :min-width="calculateWidth" label="归属人" >
        <template slot-scope="scope">
          <span>{{ scope.row.user }}</span>

        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="组别">
        <template slot-scope="scope">
          <span>{{ scope.row.userGroup }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="国家">
        <template slot-scope="scope">
          <span>{{ handleCountry(scope.row.country) }}</span>
        </template>
      </el-table-column>




      <el-table-column :min-width="calculateWidth" label="GMV" sortable column-key="gmv" pro="gmv">
        <template slot-scope="scope">
          <span>{{ scope.row.gmv }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="Creator佣金" sortable column-key="creator_commission" prop="creator_commission">
        <template slot-scope="scope">
          <span>{{ scope.row.creator_commission }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="Partner佣金" sortable column-key="partner_commission" prop="partner_commission">
        <template slot-scope="scope">
          <span>{{ scope.row.partner_commission }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="视频数量" column-key="videos" sortable pro="videos">
        <template slot-scope="scope">
          <el-link type="primary">{{ scope.row.videos }}</el-link>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="总播放量" sortable column-key="video_views" prop="video_views">
        <template slot-scope="scope">
          <span>{{ scope.row.video_views }}</span>
        </template>
      </el-table-column>


<!--      <el-table-column min-width="30px" label="新增视频数量">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.addVideos }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->



    </el-table>

    <!-- 页码 -->


  </div>
</template>


<script>
// 数据接口
import {fetchPerPidList, fetchCreatorGmvParams} from '@/api/dct'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import {parseTime} from '@/utils'
import VueRouter from 'vue-router'
import clip from '@/utils/clipboard'
import moment from 'moment'

export default {
  name: 'pidIndex',
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
      shopLogList: [],
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        creator:[],
        product_id:[],
        status:[],
        country:[],
        user:[],
        userGroup:[],
        time: []
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
      statusList: [
        {label: '正常', value: 0},
        {label: '封号', value: 1},
        {label: '弃用', value: 2}
      ],
      rotueTime:'',
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
    pid: {
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
    // if (this.$route.query && Object.getOwnPropertyNames(this.$route.query).length > 1) {
    //   this.listQuery = this.$route.query
    // }
    this.pid = this.$route.query.pid
    this.rotueTime = this.$route.query.time
    if(this.rotueTime.indexOf(",") >= 0) {
      this.listQuery.time.push(this.rotueTime.split(",")[0])
      this.listQuery.time.push(this.rotueTime.split(",")[1])
    }else {
      this.time = this.$route.query.time
    }
    this.initSelector()
    this.getList()
  },
  methods: {
    // 初始化选择框
    initSelector() {
      // 获取参数
      fetchCreatorGmvParams().then(response => {
        this.creatorList = response.data.creator
        this.userList = response.data.user
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
      this.listQuery.product_id = [this.pid]
      this.chooseMetricsList = ['date','creator','level_1_category','level_2_category','orders','gmv','videos','video_views','country','creator_commission','partner_commission']
      this.chooseGroupList = ['creator','day','level_1_category','level_2_category','country']
      let params = {pageFilterVo: this.listQuery, pageMetricsVo: this.chooseMetricsList, pageGroupVo: this.chooseGroupList, pageVO: {limit: this.limit, page: this.page, sortColumn: this.sortColumn, sortType: this.sortType}}
      fetchPerPidList(params).then(response => {
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
      if(column.columnKey=== 'videos') {
        this.$router.push({path: '/dct/DataManagement/productData/videoIndex?pid=' + this.pid  + '&creator=' + row.creator + '&time=' + this.listQuery.time[0] + "," + this.listQuery.time[1]})
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

    // 处理选择框改变时
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 前往添加页面

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


    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 设置导出列
        const filterVal = ['date','index','profile_picture','creator','belong_person', 'userGroup', 'country', 'gmv', 'creator_commission','partner_commission','videos','video_views']
        // 设置对应数据
        const tHeader = ['时间','排名','头像','Handle','归属人', '组别', '国家', 'GMV', 'creator佣金','partner佣金','视频数量','视频总播放量']
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
          filename: '单个产品数据报表'
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
