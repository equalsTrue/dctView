<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>
        <el-select v-model="listQuery.pid" multiple collapse-tags filterable clearable reserve-keyword placeholder="PID" style="margin-left: 1%">
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

        <el-select v-model="listQuery.manager" style="margin-left: 2%" multiple collapse-tags filterable clearable reserve-keyword placeholder="管理人">
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



        <el-select v-model="listQuery.status" style="margin-left: 2%" multiple collapse-tags filterable clearable reserve-keyword placeholder="样品状态">
          <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.user" style="margin-left: 2%" multiple collapse-tags filterable clearable reserve-keyword placeholder="样品使用人">
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


        <el-select v-model="listQuery.outApply" style="margin-left: 2%" multiple collapse-tags filterable clearable reserve-keyword placeholder="出库申请">
          <el-option
              v-for="item in outApplyList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>





      </el-row>

      <el-row style="margin-top: 20px">
        <!-- 搜索按钮 -->

        <el-select v-model="listQuery.applyUser" style="margin-left: 1%" multiple collapse-tags filterable clearable placeholder="申请人">
          <el-option v-for="item in userList"
                     :key="item"
                     :label="item"
                     :value="item">
            <span style="float: left">{{ item }}</span>
          </el-option>
        </el-select>

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
        <el-button v-if="!listLoading" v-waves class="filter-item" type="info" icon="el-icon-search" style="margin-left: 1%;margin-top: 1%"
                   @click="handleFilter">{{ $t('table.search') }}
        </el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
        <!-- 添加按钮 -->
        <el-button v-waves class="filter-item" style="margin-left: 1%;margin-top: 1%" type="primary" icon="el-icon-edit"
                   @click="handleToAdd">{{ $t('table.add') }}
        </el-button>

        <el-button v-waves class="filter-item" style="margin-left: 1%;margin-top: 1%" type="warning" icon="el-icon-message"
                   @click="handleToApply">批量申请</el-button>

        <el-button v-waves class="filter-item" style="margin-left: 1%;margin-top: 1%" type="success" icon="el-icon-check" v-if="checkInOperator('approve')"
                   @click="handleToApprove">批量审批
        </el-button>

        <!-- 表格导出 -->
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download" style="margin-left: 1%;margin-top: 1%"
                   @click="handleDownload">{{ $t('table.export') }}
        </el-button>

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
      style="min-width: 130%"
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

      <el-table-column :min-width="calculateWidth" label="样品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.picture" height="150%" width="100%" >
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="颜色">
        <template slot-scope="scope">
          <span>{{ scope.row.color }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="数量" column-key="count">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>

        </template>
      </el-table-column>


      <el-table-column :min-width="calculateWidth" label="申请数量" column-key="applyCount">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputCountVisible">{{ scope.row.applyCount }}</span>
          <div v-if="scope.row.inputCountVisible " >
            <el-dialog
                title="申请样品数量"
                :visible.sync="scope.row.inputCountVisible"
                width="30%">
              <el-input-number placeholder="请输入申请数量" v-model="scope.row.applyCount"  :step="1" :min="0" >
              </el-input-number>
              <el-button style="margin-left: 5%" type="primary" plain size="mini" :key="scope.row.id + '-applyCount-selector-confirm'" @click="checkApplyCount(scope.row)">{{$t('table.confirm')}}</el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-applyCount-selector-cancel'" @click="scope.row.inputCountVisible = false">{{$t('table.cancel')}}</el-button>
            </el-dialog>
          </div>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="管理人">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="区域">
        <template slot-scope="scope">
          <span>{{ handleReign(scope.row.region) }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="存放地点">
        <template slot-scope="scope">
          <span>{{ scope.row.storageLocation }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="PID">
        <template slot-scope="scope">
          <span>{{ scope.row.pid }}</span>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="状态" column-key="status">
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

              <el-button type="primary" style="margin-left: 5%" plain size="mini" :key="scope.row.id + '-Status-selector-confirm'" @click="handleSelectConfirm(scope.row,'status')">{{$t('table.confirm')}}</el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'" @click="scope.row.inputStatusVisible = false">{{$t('table.cancel')}}</el-button>

            </el-dialog>
            </div>        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="使用人" column-key="user">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputUserVisible">{{ scope.row.user }}</span>
          <div v-if="scope.row.inputUserVisible " style="width: 30px">
            <el-dialog
                title="更新使用人"
                :visible.sync="scope.row.inputUserVisible "
                width="30%">

              <el-select v-model="scope.row.user" filterable clearable placeholder="请选择使用人">
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

      <el-table-column width="200px" label="出库申请" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.outApply" :active-value='1' :inactive-value='0' :width=50 inactive-text="未申请"
                     active-text="已申请"
                     inactive-color="#ff4949" active-color="#13ce66" style="margin-left: 20px" @change="submitApply(scope.row)">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column :min-width="calculateWidth" label="申请人" column-key="applyUser">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputApplyUserVisible">{{ scope.row.applyUser }}</span>
          <div v-if="scope.row.inputApplyUserVisible " style="width: 30px">
            <el-dialog
                title="更新申请人"
                :visible.sync="scope.row.inputApplyUserVisible"
                width="30%">

              <el-select v-model="scope.row.applyUser" filterable clearable placeholder="请选择使用人">
                <el-option
                    v-for="item in userList"
                    :key="item"
                    :label="item"
                    :value="item">
                  <span style="float: left">{{ item }}</span>
                </el-option>
              </el-select>

              <el-button type="primary" style="margin-left: 5%" plain size="mini" :key="scope.row.id + '-Status-selector-confirm'" @click="handleSelectConfirm(scope.row,'applyUser')">{{$t('table.confirm')}}</el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'" @click="scope.row.inputApplyUserVisible = false">{{$t('table.cancel')}}</el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>




      <el-table-column align="center" :label="$t('table.actions')" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleToDelete(scope.row.id)">{{ $t('table.delete') }}</el-button>
          <el-button size="mini" type="primary" @click="handleToUpdate(scope.row)">{{ $t('table.update') }}</el-button>
<!--          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}</el-button>-->
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
import {fetchProductList, deleteProduct, fetchProductParams,applyProduct,approveProduct,batchApplyProduct,updateProductInfo } from '@/api/dct'
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
        pid:[],
        manager:[],
        status:[],
        user:[],
        applyUser:[],
        outApply:[],
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
        {label: '已申样', value: 0},
        {label: '到库', value: 1},
        {label: '申请中', value: 2},
        {label: '拍摄中', value: 3}
      ],
      outApplyList:[
        {label: '未申请', value: 0},
        {label: '已申请', value: 1}
      ],
      // 列表头部的筛选条件
      pidList: [],
      userList:[],
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
        this.userList = response.data.user
        this.pidList = response.data.pid
      }).catch(err => {
        console.log(err)
      })
      debugger
      this.operator = this.$route.meta.operator
    },

    checkInOperator(operator){
      debugger
      if(this.operator.indexOf(operator) > -1 || this.operator.indexOf('all') > -1){
        return  true
      }else {
        return false
      }
    },

    paresDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleReign(param){
      if(param == 'us'){
        return '美区'
      }else if(param == 'uk'){
        return '英区'
      }else {
        return  param
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
        this.listQuery.begin = moment().utcOffset(0).format('YYYY-MM-DD')
        this.listQuery.end = moment().utcOffset(0).format('YYYY-MM-DD')
      } else {
        this.listQuery.begin = moment(this.dateRange[0]).format('YYYY-MM-DD')
        this.listQuery.end = moment(this.dateRange[1]).format('YYYY-MM-DD')
      }
      fetchProductList(this.listQuery).then(response => {
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

    checkApplyCount(row){
      if(row.count >= row.applyCount){
        row.inputCountVisible =false
      }else {
        this.$message.error("申请数量大于样品数量，请输入正确数量")
        row.inputCountVisible = false
      }
    },
    calculateWidth(){
      let width = parseFloat(100/10).toFixed(2) + "%"
      return width
    },
    submitApply(row){
      if(row.status == 1){
        const param = {id: row.id,applyCount:row.applyCount, applyUser:row.applyUser, user:row.user,productName:row.productName, count:row.count}
        applyProduct(param).then(response =>{
          if(response.data == 'success'){
            this.getList()
            this.$message.success("已提交申请")
          }else {
            this.$message.error("申请出错")
          }
        })
      }else {
        this.$message.error("当样品状态为到库才能申请")
      }
    },
    chooseColor(status) {
      let str


      switch (status){
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
          .catch(_ => {});
    },
    handleSelectConfirm(row,type){
      let params
      const that = this
      let alert
      let updateType
      switch (type){
        case 'status':
          alert = '是否修改状态'
          updateType = 0
          params = {id: row.id,status:row.status,  type:updateType}
          break;
        case  'user':
          alert = '是否修改使用人'
          updateType = 1
          params = {id: row.id,user:row.user,  type:updateType}
          break
        case 'applyUser':
          alert = '是否修改申请人'
          updateType = 2
          params = {id: row.id, applyUser:row.applyUser,  type:updateType}
          break;
        default:
      }
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
            this.closeVisible(type,row)
          }
        }).catch(err => {
          console.log(err)
        })
      })
      row.inputVisible = false
    },

    closeVisible(type,row){
      if (type === 'applyCount') {
        row.inputCountVisible = false
      }
      if(type === 'user'){
        row.inputUserVisible = false
      }
      if(type === 'applyUser'){
        row.inputApplyUserVisible = false
      }
    },
    handleStatus(status){
      let str
      switch (status){
        case 0:
          str = '已申样'
          break;
        case 1:
          str = '在库'
              break;
        case 2:
          str = '申请中'
              break;
        case 3:
          str = '拍摄中'
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
      if(column.columnKey === 'status' ){
        row.inputStatusVisible = true

      }
      if(column.columnKey === 'applyUser'){
        row.inputApplyUserVisible = true
      }
      if(column.columnKey=== 'user'){
        row.inputUserVisible = true
      }
    },
    handleToApply(){
      batchApplyProduct(this.multipleSelection).then(response =>{
        if(response.data == 'success'){
          this.getList()
          this.$message.success("批量申请成功")
        }else {
          this.$message.error("批量申请失败")
        }
      })
    },
    handleToApprove(){
      let ids = []
      this.multipleSelection.forEach(a=>{
        ids.push(a.id)
      })
      let params = {id:ids}
      approveProduct(params).then(response => {
        if(response.data == 'success'){
          this.getList()
          this.$message.success("审批通过")
        }else {
          this.$message.error("审批失败")
        }
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
    },
    // 前往添加页面
    handleToAdd() {
      this.$router.push({path: '/dct/ProductManagement/add'})
    },

    handleToUpdate(row) {
      this.$router.push({path: '/dct/ProductManagement/update/' + row.id, query: {isRestock: false}})
    },
    handleToDelete(id){
      const that = this
      that.$confirm( '删除该样品', {
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
        const filterVal = ['createTime', 'productName', 'color', 'count', 'manager', 'region', 'storeLocation', 'pid','status','user','applyUser']
        // 设置对应数据
        const tHeader = ['时间', '商品名称', '颜色', '数量', '管理人', '地区', '存放地点', 'PID','状态','使用人','申请人']
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
