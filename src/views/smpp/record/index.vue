<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>
        <el-select v-model="listQuery.mobile" filterable clearable remote reserve-keyword placeholder="用户号码"
                   :remote-method="remoteMobileMethod" :loading="mobileLoading">
          <el-option
            v-for="item in mobileOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span v-if="item.label !== item.value" style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
        <el-select v-model="listQuery.status" filterable placeholder="状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <span style="float: left">{{ item.label }}</span>
            <span v-if="item.label !== item.value" style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
        <el-input v-model="listQuery.content" placeholder="信息包含内容" clearable style="width: 300px;"></el-input>
        <label style="font-size: 15px;color: #606266;">(当前时区)：</label>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
        <!-- 搜索按钮 -->
        <el-button v-if="!listLoading" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
        <!-- 列表增加项按钮 -->
        <el-checkbox v-model="showId" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">显示主键</el-checkbox>
        <label style="font-size: 15px;color: #606266;">刷新</label>
        <el-input-number size="small" v-model="refreshSeconds" :min="3" :max="60" controls-position="right"></el-input-number><span style="font-size: 13px;color: #606266;">(秒/sec)</span>
      </el-row>
      <el-row>
        <!-- 设置最大发送次数 -->
        <el-button v-waves class="filter-item" type="warning" @click="handleShowResetMaxSend" style="float: right;margin-right:100px;">设置最大发送次数</el-button>
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
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <!-- 选择框 -->
      <el-table-column type="selection" width=55>
      </el-table-column>
      <el-table-column type="index" width="50">
      </el-table-column>

      <el-table-column v-if="showId" :label="$t('table.id')" width=200 align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width=160 align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="50px" align="center" label="SMPP ID">
        <template slot-scope="scope">
          <span>{{scope.row.smppId}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" align="center" label="Destination Address">
        <template slot-scope="scope">
          <span>{{scope.row.destAddr}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" align="center" label="Source Address">
        <template slot-scope="scope">
          <span>{{scope.row.sourceAddr}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" label="Content">
        <template slot-scope="scope">
          <span>{{scope.row.body}}</span>
        </template>
      </el-table-column>

      <el-table-column width=160 align="center" label="提交时间">
        <template slot-scope="scope">
          <span v-if="scope.row.submitDate !== null">{{new Date(scope.row.submitDate).getTime() | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width=160 align="center" label="完成时间">
        <template slot-scope="scope">
          <span v-if="scope.row.doneDate !== null">{{new Date(scope.row.doneDate).getTime() | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>


      <el-table-column width=150 align="center" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.finalStatus">{{ scope.row.finalStatus }}</el-tag>
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

    <el-dialog
      title="提示"
      :visible.sync="showResetMaxSend"
      width="25%"
      center>
      <el-input-number size="small" v-model="maxSend" :min="1"controls-position="right"></el-input-number><span style="font-size: 13px;color: #606266;">(次)</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showResetMaxSend = false">取 消</el-button>
    <el-button type="primary" @click="handleResetMaxSend">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
// 数据接口
import { fetchList, remoteMobile, getMaxSend, resetMaxSend } from '@/api/esme/smpp'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import { parseTime } from '@/utils'

export default {
  name: 'payAlliance',
  component: {
    parseTime
  },
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
        limit: 10,
        status: '',
        begin: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0).getTime(),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59).getTime(),
        mobile: undefined,
        content: undefined,
        sort: 'desc'
      },
      // 选项框加载状态
      loading: true,
      // 列表头部的筛选条件
      mobileOptions: [],
      mobileLoading: false,
      statusOptions: [
        { identification: '0', label: '全部', value: '' },
        { identification: '1', label: 'DELIVRD', value: 'DELIVRD' },
        { identification: '2', label: 'UNDELIV', value: 'UNDELIV' }
      ],
      // 是否显示主键的列
      showId: false,
      // 是否正在导出
      downloadLoading: false,
      // 多选
      multipleSelection: [],
      showResetMaxSend: false,
      maxSend: 0,
      refreshSeconds: 10,
      dateRange: [
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0),
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59)
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  filters: {
  },
  created() {
    if (this.$route.query && Object.getOwnPropertyNames(this.$route.query).length > 1) {
      this.listQuery = this.$route.query
    }
    this.getList()
  },
  methods: {
    handleShowResetMaxSend() {
      getMaxSend(this.maxSend).then(response => {
        this.maxSend = response.data
        this.showResetMaxSend = true
      }).catch((err) => {
        console.error(err)
      })
    },
    handleResetMaxSend() {
      this.$confirm('是否确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetMaxSend(this.maxSend).then(response => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'error',
              duration: 2000
            })
          }
        }).catch((err) => {
          console.error(err)
        })
        this.showResetMaxSend = false
      }).catch(() => {})
    },
    remoteMobileMethod(query) {
      this.mobileLoading = true
      if (query !== null && query.length > 0) {
        remoteMobile(query).then(response => {
          this.mobileLoading = false
          this.mobileOptions = response.data
        }).catch((err) => {
          this.mobileLoading = false
          console.error(err)
        })
      }
    },
    // 获取列表数据
    getList() {
      if (this.$store.state.tagsView.visitedViews.length > 0) {
        const index = this.$store.state.tagsView.active
        this.$store.state.tagsView.visitedViews[index].query = Object.assign({}, this.listQuery)
      }
      const that = this
      this.listLoading = true
      this.listQuery.begin = this.dateRange[0].getTime()
      this.listQuery.edn = this.dateRange[1].getTime()
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
        // 每 refreshSeconds 秒刷新一次列表
        setTimeout(() => {
          that.getList()
        }, that.refreshSeconds * 1000)
      }).catch((err) => {
        this.listLoading = false
        console.error(err)
      })
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
