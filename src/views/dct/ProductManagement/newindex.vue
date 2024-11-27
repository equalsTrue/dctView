<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>
        <el-select v-model="listQuery.pid" multiple collapse-tags filterable clearable reserve-keyword placeholder="PID"
                   style="margin-left: 1%">
          <el-option
              v-for="item in pidList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>
        <el-select v-model="listQuery.productName" multiple collapse-tags filterable clearable reserve-keyword
                   placeholder="样品名称" style="margin-left: 1%">
          <el-option
              v-for="item in productNameList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item
              }}</span>
          </el-option>
        </el-select>

        <el-select v-model="listQuery.user" style="margin-left: 2%" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="样品使用人">
          <el-option
              v-for="item in userList"
              :key="item"
              :label="item"
              :value="item">
            <span style="float: left">{{ item }}</span>
            <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
          </el-option>
        </el-select>

        <el-select v-model="listQuery.status" style="margin-left: 2%" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="样品状态">
          <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>


<!--      </el-row>-->

<!--      <el-row style="margin-top: 20px">-->
        <!-- 搜索按钮 -->

        <label style="font-size: 0.9em;color: #606266;margin-left: 20px" v-if="!isToday">到样时间：</label>
        <el-date-picker
            v-if="!isToday"
            v-model="dateRange"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
        </el-date-picker>


      </el-row>

      <el-row>
        <el-button v-if="!listLoading" v-waves class="filter-item" type="info" icon="el-icon-search"
                   style="margin-left: 1%;margin-top: 1%"
                   @click="handleFilter">{{ $t('table.search') }}
        </el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
        <!-- 添加按钮 -->
<!--        <el-table-column width="200px" label="出库申请" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-switch v-model="scope.row.outApply" :active-value='1' :inactive-value='0' :width=50 inactive-text="未申请"-->
<!--                       active-text="已申请"-->
<!--                       inactive-color="#ff4949" active-color="#13ce66" style="margin-left: 20px" @change="submitApply(scope.row)">-->
<!--            </el-switch>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-button v-waves class="filter-item" style="margin-left: 1%;margin-top: 1%" type="warning" icon="el-icon-message"-->
<!--                   @click="submitApply">批量申请-->
<!--        </el-button>-->


<!--        <el-button v-waves class="filter-item" style="margin-left: 1%;margin-top: 1%" type="warning"-->
<!--                   icon="el-icon-message"-->
<!--                   @click="handleToApply">归还-->
<!--        </el-button>-->

        <el-button v-waves class="filter-item" style="margin-left: 1%;margin-top: 1%" type="success" icon="el-icon-check" v-if="checkInOperator('approve')"
                   @click="handleSelectConfirm">批量审批
        </el-button>

        <!-- 表格导出 -->
<!--        <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download"-->
<!--                   style="margin-left: 1%;margin-top: 1%"-->
<!--                   @click="handleDownload">{{ $t('table.export') }}-->
<!--        </el-button>-->

        <el-checkbox v-model="showId" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">显示主键
        </el-checkbox>
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
          <span class="link-type">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width=150px align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{ new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="样品名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="样品图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picture" height="150%" width="100%">
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="PID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="申请人" column-key="applyUser" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyUser }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="颜色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="使用数量" column-key="applyCount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyCount }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="状态" column-key="status" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputStatusVisible" :style=chooseColor(scope.row.status)>{{ handleStatus(scope.row.status) }}</span>
          <div v-if="scope.row.inputStatusVisible " style="width: 30px">
            <el-dialog
                title="更新状态"
                :visible.sync="scope.row.inputStatusVisible "
                width="30%">

              <el-select v-model="scope.row.status" filterable clearable placeholder="请选择状态">
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>

              <el-button type="primary" style="margin-left: 5%" plain size="mini" :key="scope.row.id + '-Status-selector-confirm'" @click="handleSelectConfirmTo(scope.row,'status')">{{$t('table.confirm')}}</el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'" @click="scope.row.inputStatusVisible = false">{{$t('table.cancel')}}</el-button>

            </el-dialog>
          </div>        </template>
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


    <!--    <el-dialog title="操作日志" :append-to-body="false" :visible.sync="dialogCommodityLog" width="65%">-->
    <!--      <el-table-->
    <!--        :key='tableKey'-->
    <!--        :data="shopLogList"-->
    <!--        element-loading-text="拼命加载中"-->
    <!--        border-->
    <!--        fit-->
    <!--        highlight-current-row-->
    <!--        style="width: 100%"-->
    <!--        height="650">-->
    <!--        <el-table-column min-width="80px" label="createtime" prop="createtime">-->
    <!--          <template slot-scope="scope">-->
    <!--            <span>{{paresDate(new Date(scope.row.createTime))}}</span>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column min-width="40px" label="操作人" prop="user">-->
    <!--          <template slot-scope="scope">-->
    <!--            <span>{{scope.row.user}}</span>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column min-width="50px" label="操作方法" prop="method">-->
    <!--          <template slot-scope="scope">-->
    <!--            <span>{{scope.row.method}}</span>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column min-width="400px" label="更新内容" prop="updateContent">-->
    <!--          <template slot-scope="scope">-->
    <!--            <span>{{scope.row.updateContent}}</span>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--      </el-table>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button type="primary" @click="dialogCommodityLog = false">{{ $t('table.confirm') }}</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

  </div>
</template>


<script>
// 数据接口
import {
  deleteProduct,
  fetchOutboundList,
  fetchProductParams,
  applyProduct,
  approveProduct,
  batchApplyProduct,
  updateProductInfo
} from '@/api/dct'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import {parseTime} from '@/utils'
import VueRouter from 'vue-router'
import clip from '@/utils/clipboard'
import moment from 'moment'

export default {
  name: 'product',
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
        pid: [],
        manager: [],
        status: [],
        user: [],
        applyUser: [],
        outApply: [],
        sort: 'desc',
        begin: moment().format('YYYY-MM-DD'),
        end: moment().format('YYYY-MM-DD'),
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
      // 选项框加载状态
      loading: false,
      // 列表头部的筛选条件
      statusList: [
        {label: '拍摄中', value: 3},
        {label: '归还', value: 4}
      ],
      // 列表头部的筛选条件
      productNameList: [],
      pidList: [],
      userList: [],
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
      fetchProductParams().then(response => {
        this.productNameList = response.data.productName
        this.userList = response.data.user
        this.pidList = response.data.pid
      }).catch(err => {
        console.log(err)
      })
      this.operator = this.$route.meta.operator
    },
    paresDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleReign(param) {
      if (param == 'us') {
        return '美区'
      } else if (param == 'gb') {
        return '英区'
      } else {
        return param
      }
    },
    // 获取列表数据
    getList() {
      debugger
      this.list = []
      // if (this.$store.state.tagsView.visitedViews.length > 0) {
      //   const index = this.$store.state.tagsView.active
      //   this.$store.state.tagsView.visitedViews[index].query = Object.assign({}, this.listQuery)
      // }
      this.listLoading = true
      if (this.isToday) {
        this.listQuery.time = [moment().utcOffset(0).format('YYYY-MM-DD') + ' 00:00:00', moment().utcOffset(0).format('YYYY-MM-DD') + ' 23:59:59']
      } else {
        this.listQuery.time = [moment(this.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00', moment(this.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59']
      }
      fetchOutboundList(this.listQuery).then(response => {
        this.total = response.data.total
        this.listLoading = false
        const tableList = []
        for (const row of response.data.list) {
          row.inputCountVisible = false
          row.inputStatusVisible = false
          row.inputUserVisible = false
          row.inputApplyUserVisible = false
          tableList.push(row)
        }
        this.list = tableList
      }).catch(() => {
      })
    },

    checkApplyCount(row) {
      if (row.count >= row.applyCount) {
        row.inputCountVisible = false
      } else {
        this.$message.error("申请数量大于样品数量，请输入正确数量")
        row.inputCountVisible = false
      }
    },
    calculateWidth() {
      let width = parseFloat(100 / 10).toFixed(2) + "%"
      return width
    },
    submitApply() {
      const row = this.multipleSelection
      console.log(row)
      console.log(row[0].status)
      // if (row[0].status == 1) {
      //   const param = {
      //     id: row.id,
      //     applyCount: row.applyCount,
      //     applyUser: row.applyUser,
      //     user: row.user,
      //     productName: row.productName,
      //     count: row.count
      //   }
        // applyProduct(param).then(response => {
        //   if (response.data == 'success') {
        //     this.getList()
        //     this.$message.success("已提交申请")
        //   } else {
        //     this.$message.error("申请出错")
        //   }
        // })
      // } else {
      //   this.$message.error("当样品状态为到库才能申请")
      // }
    },
    chooseColor(status) {
      let str
      switch (status) {
        case 0:
          str = ' backgroundColor: \'#9aaabf\''
          break;
        case 1:
          str = ' backgroundColor: \'#9aaabf\''
          break;
        case 2:
          str = ' backgroundColor: \'#9aaabf\''
          break;
        default:
          str = ' backgroundColor: \'#9aaabf\''
      }
      return str
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    handleSelectConfirmTo(row, type) {
      const info = {"batchApply":this.multipleSelection}
      console.log(info)
      let params
      const that = this
      let alert
      let updateType
      params = {id: row.id, status: row.status, type: updateType}
      that.$confirm(alert, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateProductInfo(params).then(response => {
          if (response.code === 200) {
            that.getList()
            that.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.closeVisible(type, row)
          }
        }).catch(err => {
          console.log(err)
        })
      })
      row.inputVisible = false
    },
    handleSelectConfirm() {
      const info = {"batchApply":this.multipleSelection}
      updateProductInfo(info).then(response => {
        if(response.code === 200){
          this.getList()
          this.$message.success("批量申请成功")
        }else {
          this.$message.error("批量申请失败")
        }
      }).catch(err => {
        console.log(err)
      })
    },

    closeVisible(type, row) {
      if (type === 'applyCount') {
        row.inputCountVisible = false
      }
      if (type === 'user') {
        row.inputUserVisible = false
      }
      if (type === 'applyUser') {
        row.inputApplyUserVisible = false
      }
    },
    handleStatus(status) {
      let str
      switch (status) {
        case 3:
          str = '拍摄中'
          break;
        case 4:
          str = '归还'
          break;
        default:
          str = '未设置'
      }
      return str
    },
    handleCellDoubleClick(row, column, cell, event) {
      debugger
      if (column.columnKey === 'applyCount') {
        row.inputCountVisible = true
      }
      if (column.columnKey === 'status') {
        row.inputStatusVisible = true

      }
      if (column.columnKey === 'applyUser') {
        row.inputApplyUserVisible = true
      }
      if (column.columnKey === 'user') {
        row.inputUserVisible = true
      }
    },
    handleToApply(){
      const info = {"batchApply":this.multipleSelection}
      batchApplyProduct(info).then(response =>{
        if(response.data == 'success'){
          this.getList()
          this.$message.success("批量申请成功")
        }else {
          this.$message.error("批量申请失败")
        }
      })
    },
    handleToApprove() {
      let ids = []
      this.multipleSelection.forEach(a => {
        ids.push(a.id)
      })
      let params = {id: ids}
      approveProduct(params).then(response => {
        if (response.data == 'success') {
          this.getList()
          this.$message.success("审批通过")
        } else {
          this.$message.error("审批失败")
        }
      })
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

    handleToUpdate(row) {
      this.$router.push({path: '/dct/ProductManagement/update/' + row.id, query: {isRestock: false}})
    },
    handleToDelete(id) {
      const that = this
      that.$confirm('删除该样品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(id).then(response => {
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
        const filterVal = ['createTime', 'productName', 'color', 'count', 'manager', 'region', 'storeLocation', 'pid', 'status', 'user', 'applyUser']
        // 设置对应数据
        const tHeader = ['时间', '商品名称', '颜色', '数量', '管理人', '地区', '存放地点', 'PID', '状态', '使用人', '申请人']
        const filterList = []
        this.list.forEach((item, index) => {
          filterList.push(item)
        })
        const data = this.formatJson(filterVal, filterList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '商品报表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseTime(v[j])
        } else if (j === 'status') {
          return this.handleStatus(v[j])
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
