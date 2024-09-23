<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>
<!--        <el-select v-model="listQuery.username" filterable clearable placeholder="用户">-->
        <el-select v-model="listQuery.username" filterable clearable placeholder="用户">
          <el-option
            v-for="item in users"
            :key="item.id"
            :label="item.username"
            :value="item.username">
          </el-option>
        </el-select>
        <label style="font-size: 15px;color: #606266;padding-left: 10px">时间范围(当前时区)：</label>
        <el-date-picker
          v-model="listQuery.time"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          align="right">
        </el-date-picker>
        <!-- 搜索按钮 -->
        <el-button v-if="!listLoading" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
<!--        <el-checkbox v-model="showFullInfo" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">显示参数信息</el-checkbox>-->
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
      style="width: 100%">
      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="50px" label="用户" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="50px" label="系统">
        <template slot-scope="scope">
          <span>{{scope.row.system}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="50px" label="url">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showFullInfo" min-width="50px" align="center" label="request data">
        <template slot-scope="scope">
          <span>{{scope.row.requestData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showFullInfo" min-width="50px" align="center" label="response data">
        <template slot-scope="scope">
          <span>{{scope.row.responseData}}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="showFullInfo" min-width="50px" align="center" label="response status">
        <template slot-scope="scope">
          <span>{{scope.row.responseStatus}}</span>
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
        :page-sizes="[30,50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
// 数据接口
import { fetchLogList } from '@/api/log'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import clip from '@/utils/clipboard'
import {fetchList} from "@/api/user";
// import {fetchLogList} from "@/api/DCT"; // use clipboard directly

export default {
  name: 'log',
  directives: {
    waves
  },
  data() {
    return {
      // 表格的key，改变后表格会重新渲染
      tableKey: 0,
      // 列表数据集
      list: null,
      // 列表数据总计
      total: null,
      // 列表加载状态
      listLoading: true,
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        page: 1,
        limit: 30,
        // begin: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime(),
        // end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime(),
        time: [
          this.formatDateToday() + ' 00:00:00',
          this.formatDateToday() + ' 23:59:59'
        ],
        username: undefined,
        // sort: 'desc'
      },
      dateRange: [
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      // 选项框加载状态
      loading: true,
      users: [],
      showFullInfo: false
    }
  },
  filters: {
  },
  created() {
    this.initSelector()
    this.getList()
  },
  methods: {
    handleCopy(row, event) {
      clip(row.data, event)
    },
    // 初始化选择框
    initSelector() {
      // 获取offerids
      fetchList().then(response => {
        this.users = response.data
      }).catch(err => {
        this.fetchSuccess = false
        console.log(err)
      })
      this.showFullInfo = true
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      if (this.listQuery.time === null) {
        this.$notify({
          title: '失败',
          message: '请选择查询时间',
          type: 'error',
          duration: 2000
        })
      }else {
        debugger
        fetchLogList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      }
    },
    // 修改筛选添加后重新加载列表数据
    handleFilter() {
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
</style>
