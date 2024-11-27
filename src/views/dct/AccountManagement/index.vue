<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-row>

        <el-select v-model="listQuery.creator" style="margin-left: 20px" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="Handle">
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

        <el-select v-model="listQuery.uid" style="margin-left: 20px" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="UID">
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

        <el-select v-model="listQuery.belongPerson" style="margin-left: 20px" multiple collapse-tags filterable
                   clearable reserve-keyword placeholder="归属人">
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


        <el-select v-model="listQuery.userGroup" style="margin-left: 20px" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="组别">
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

        <el-select v-model="listQuery.country" style="margin-left: 20px" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="国家">
          <el-option
              v-for="item in countryList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>


        <el-select v-model="listQuery.status" style="margin-left: 20px" multiple collapse-tags filterable clearable
                   reserve-keyword placeholder="状态">
          <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>

        <el-select v-model="listQuery.assignStatus" style="margin-left: 20px" multiple filterable clearable
                   reserve-keyword placeholder="分配状态">
          <el-option
              v-for="item in assignStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>


      </el-row>


      <el-row style="margin-top: 20px">
        <!-- 搜索按钮 -->


        <el-button v-if="!listLoading" v-waves class="filter-item" type="info" icon="el-icon-search"
                   style="margin-left: 5%"
                   @click="handleFilter">{{ $t('table.search') }}
        </el-button>
        <el-button v-else class="filter-item" type="primary" icon="el-icon-loading">Loading</el-button>
        <!-- 添加按钮 -->
        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                   @click="handleToAdd">{{ $t('table.add') }}
        </el-button>

        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="warning" icon="el-icon-message"
                   @click="queryLog">查询日志
        </el-button>


        <!-- 表格导出 -->
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="danger" icon="el-icon-download"
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

      <el-table-column min-width="20px" label="Handle">
        <template slot-scope="scope">
          <span>{{ scope.row.creator }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="20px" label="UID">
        <template slot-scope="scope">
          <span>{{ scope.row.uid }}</span>
        </template>
      </el-table-column>


      <el-table-column min-width="20px" label="归属人" column-key="belongPerson">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputUserVisible">{{ scope.row.belongPerson }}</span>
          <div v-if="scope.row.inputUserVisible && checkInOperator('handle')" style="width: 30px">
            <el-dialog
                title="更新使用人"
                :visible.sync="scope.row.inputUserVisible && checkInOperator('handle')"
                width="30%"
                :append-to-body="false">

              <el-select v-model="scope.row.belongPerson" filterable clearable placeholder="请选择归属人">
                <el-option
                    v-for="item in userList"
                    :key="item"
                    :label="item"
                    :value="item">
                  <span style="float: left">{{ item }}</span>
                </el-option>
              </el-select>

              <el-button type="primary" style="margin-left: 5%" plain size="mini"
                         :key="scope.row.id + '-Status-selector-confirm'"
                         @click="belongPersonSelectConfirm(scope.row,'belongPerson')">{{ $t('table.confirm') }}
              </el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'"
                         @click="scope.row.inputUserVisible = false">{{ $t('table.cancel') }}
              </el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="组别">
        <template slot-scope="scope">
          <span>{{ scope.row.userGroup }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="国家" column-key="country">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputCountryVisible">{{ handleCountry(scope.row.country) }}</span>
          <div v-if="scope.row.inputCountryVisible && checkInOperator('handle')" style="width: 30px">
            <el-dialog
                title="更新国家"
                :visible.sync="scope.row.inputCountryVisible && checkInOperator('handle')"
                width="30%"
                :modal-append-to-body="false">

              <el-select v-model="scope.row.country" filterable clearable placeholder="请选择国家">
                <el-option
                    v-for="item in countryList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>


              <el-button type="primary" style="margin-left: 5%" plain size="mini"
                         :key="scope.row.id + '-Status-selector-confirm'"
                         @click="handleSelectConfirm(scope.row,'country')">{{ $t('table.confirm') }}
              </el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'"
                         @click="scope.row.inputCountryVisible = false">{{ $t('table.cancel') }}
              </el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="账号类型" column-key="account_type">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputAccountTypeVisible">{{ scope.row.account_type }}</span>
          <div v-if="scope.row.inputAccountTypeVisible && checkInOperator('handle')" style="width: 30px">
            <el-dialog
                title="更新账号类型"
                :visible.sync="scope.row.inputAccountTypeVisible && checkInOperator('handle')"
                width="30%"
                :modal-append-to-body="false">

              <el-select v-model="scope.row.account_type" filterable clearable placeholder="请选择账号类型">
                <el-option
                    v-for="item in accountTypeList"
                    :key="item"
                    :label="item"
                    :value="item">
                  <span style="float: left">{{ item }}</span>
                </el-option>
              </el-select>


              <el-button type="primary" style="margin-left: 5%" plain size="mini"
                         :key="scope.row.id + '-Status-selector-confirm'"
                         @click="handleSelectConfirm(scope.row,'account_type')">{{ $t('table.confirm') }}
              </el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'"
                         @click="scope.row.inputAccountTypeVisible = false">{{ $t('table.cancel') }}
              </el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="类目" column-key="category">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputCategoryVisible">{{ scope.row.category }}</span>
          <div v-if="scope.row.inputCategoryVisible && checkInOperator('category')" style="width: 30px">
            <el-dialog
                title="更新类目"
                :visible.sync="scope.row.inputCategoryVisible && checkInOperator('category')"
                width="30%"
                :modal-append-to-body="false">

              <el-input
                  placeholder="请输入类目"
                  v-model="scope.row.category"
                  clearable>
              </el-input>

              <el-button type="primary" style="margin-left: 1%;margin-top: 3%" plain size="mini"
                         :key="scope.row.id + '-Status-selector-confirm'"
                         @click="handleSelectConfirm(scope.row,'category')">{{ $t('table.confirm') }}
              </el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'"
                         @click="scope.row.inputCategoryVisible = false">{{ $t('table.cancel') }}
              </el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="分配状态">
        <template slot-scope="scope">
          <span>{{ scope.row.assignStatus == 0 || scope.row.assignStatus == null ? '可分配' : '已分配' }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="分配人">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="账号状态" column-key="status">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputStatusVisible">{{ handleStatus(scope.row.status) }}</span>
          <div v-if="scope.row.inputStatusVisible && checkInOperator('handle')" style="width: 30px">
            <el-dialog
                title="更新状态"
                :visible.sync="scope.row.inputStatusVisible && checkInOperator('handle')"
                width="30%"
                :modal-append-to-body="false">

              <el-select v-model="scope.row.status" filterable clearable placeholder="请选择状态">
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                </el-option>
              </el-select>

              <el-button type="primary" style="margin-left: 5%" plain size="mini"
                         :key="scope.row.id + '-Status-selector-confirm'"
                         @click="handleSelectConfirm(scope.row,'status')">{{ $t('table.confirm') }}
              </el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'"
                         @click="scope.row.inputStatusVisible = false">{{ $t('table.cancel') }}
              </el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>


      <el-table-column min-width="30px" label="交付日期">
        <template slot-scope="scope">
          <span>{{ scope.row.deliverTime }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="30px" label="封号日期">
        <template slot-scope="scope">
          <span>{{ scope.row.closeTime }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="20px" label="备注" column-key="notes">
        <template slot-scope="scope">
          <span v-if="!scope.row.inputNotesVisible">{{ scope.row.notes }}</span>
          <div v-if="scope.row.inputNotesVisible && checkInOperator('notes')" style="width: 30px">
            <el-dialog
                title="更新备注"
                :visible.sync="scope.row.inputNotesVisible && checkInOperator('notes')"
                width="30%"
                :modal-append-to-body="false">

              <el-input
                  placeholder="请输入备注"
                  v-model="scope.row.notes"
                  clearable>
              </el-input>

              <el-button type="primary" style="margin-left: 1%;margin-top: 3%" plain size="mini"
                         :key="scope.row.id + '-Status-selector-confirm'"
                         @click="handleSelectConfirm(scope.row,'notes')">{{ $t('table.confirm') }}
              </el-button>
              <el-button type="warning" plain size="mini" :key="scope.row.id + '-Status-selector-cancel'"
                         @click="scope.row.inputNotesVisible = false">{{ $t('table.cancel') }}
              </el-button>

            </el-dialog>
          </div>
        </template>
      </el-table-column>


      <el-table-column align="center" :label="$t('table.actions')" width=150 class-name="small-padding fixed-width"
                       v-if="checkInOperator('handle')">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleToUpdate(scope.row)">
            {{ $t('table.update') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleToDelete(scope.row.id)">{{
              $t('table.delete')
            }}
          </el-button>
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


    <el-dialog title="操作日志" :append-to-body="false" :visible.sync="dialogLog" width="65%" height="40%">
      <div class="filter-container">

        <el-row>
          <el-select v-model="logQuery.creator" style="margin-left: 20px" filterable clearable reserve-keyword
                     placeholder="Handle">
            <el-option
                v-for="item in handleList"
                :key="item"
                :label="item"
                :value="item">
              <span style="float: left">{{ item }}</span>
              <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
            </el-option>
          </el-select>

          <el-select v-model="logQuery.uid" style="margin-left: 20px" filterable clearable reserve-keyword
                     placeholder="UID">
            <el-option
                v-for="item in logUidList"
                :key="item"
                :label="item"
                :value="item">
              <span style="float: left">{{ item }}</span>
              <span v-if="item !== item" style="float: right; color: #8492a6; font-size: 13px">{{
                  item
                }}</span>
            </el-option>
          </el-select>


          <label style="font-size: 0.9em;color: #606266;margin-left: 15px">请选择时间：</label>
          <el-date-picker
              style="margin-left: 5px"
              v-model="logQuery.time"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions">
          </el-date-picker>

          <el-button v-if="!listLoading" v-waves class="filter-item" type="success" icon="el-icon-search"
                     style="margin-left: 5%"
                     @click="queryLogInfo">{{ $t('table.search') }}
          </el-button>

        </el-row>


      </div>


      <el-table
          :key='tableKey'
          :data="accountLogList"
          element-loading-text="拼命加载中"
          border
          fit
          highlight-current-row
          style="width: 100%"
          max-height="70%">
        <el-table-column min-width="40px" label="createtime" sortable prop="createTime">
          <template slot-scope="scope">
            <span>{{ paresDate(new Date(scope.row.createTime)) }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="20px" label="修改前creator" prop="creator">
          <template slot-scope="scope">
            <span>{{ scope.row.handler }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="20px" label="修改后creator" prop="creator">
          <template slot-scope="scope">
            <span>{{ scope.row.creator }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="30px" label="UID" prop="uid">
          <template slot-scope="scope">
            <span>{{ scope.row.uid }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="20px" label="前归属人" prop="beforePerson">
          <template slot-scope="scope">
            <span>{{ scope.row.beforePerson }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="20px" label="现归属人" prop="localPerson">
          <template slot-scope="scope">
            <span>{{ scope.row.localPerson }}</span>
          </template>
        </el-table-column>


        <el-table-column min-width="20px" label="前状态" prop="beforeStatus">
          <template slot-scope="scope">
            <span>{{ handleStatus(scope.row.beforeStatus) }}</span>
          </template>
        </el-table-column>


        <el-table-column min-width="20px" label="现状态" prop="localStatus">
          <template slot-scope="scope">
            <span>{{ handleStatus(scope.row.localStatus) }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="20px" label="操作人" prop="localStatus">
          <template slot-scope="scope">
            <span>{{ scope.row.manager }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogLog = false">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
// 数据接口
import {
  fetchAccountList,
  deleteAccount,
  fetchAccountParams,
  updateAccount,
  queryAccountLog,
  assignAccount, exportAccountList
} from '@/api/dct'
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
      operator: '',
      // 列表数据总计
      total: null,
      // 列表加载状态
      listLoading: false,
      shopLogList: [],
      // 列表请求条件，既给接口传递的参数
      listQuery: {
        page: 1,
        assignStatus: [],
        limit: 10,
        uid: [],
        creator: [],
        status: [],
        belongPerson: [],
        country: [],
        userGroup: [],
      },
      dialogLog: false,
      logQuery: {
        uid: '',
        creator: '',
        time: [
          this.formatDateToday() + ' 00:00:00',
          this.formatDateToday() + ' 23:59:59'
        ]
      },
      accountLogList: [],
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
      assignStatusList: [
        {label: '可分配', value: 0},
        {label: '已分配', value: 1}
      ],
      groupList: [],
      // 列表头部的筛选条件
      uidList: [],
      logUidList: [],
      userList: [],
      creatorList: [],
      handleList: [],
      userGroupList: [],
      countryList: [
        {label: '美国', value: 'us'},
        {label: '英国', value: 'gb'}
      ],
      accountTypeList: [
        '加白号',
        '渠道号',
        '店铺号',
        '千粉号',
        '万粉号'
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
      fetchAccountParams().then(response => {
        this.userList = response.data.belongPerson
        this.uidList = response.data.uid
        this.creatorList = response.data.creator
        this.userGroupList = response.data.userGroup
        this.handleList = response.data.handles
        this.logUidList = response.data.logUid
      }).catch(err => {
        console.log(err)
      })
      this.operator = this.$route.meta.operator
    },
    paresDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCanceledit(row) {
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
      fetchAccountList(this.listQuery).then(response => {
        this.total = response.data.total
        this.listLoading = false
        const tableList = []
        for (const row of response.data.list) {
          row.inputStatusVisible = false
          row.inputCountryVisible = false
          row.inputUserVisible = false
          row.inputCategoryVisible = false
          row.inputNotesVisible = false
          row.inputAccountTypeVisible = false
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
    handleCountry(str) {
      if (str == 'us') {
        return '美国'
      } else {
        return '英国'
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
          params = {id: row.id, belongPerson: row.belongPerson}
          break;
        case  'notes':
          alert = '是否修改备注'
          params = {id: row.id, notes: row.notes}
          break;
        case  'category':
          alert = '是否修改类目'
          params = {id: row.id, category: row.category}
          break;
        case  'country':
          alert = '是否修改国家'
          params = {id: row.id, country: row.country}
          break
        case  'account_type':
          alert = '是否修改账号类型'
          params = {id: row.id, accountType: row.account_type}
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
    belongPersonSelectConfirm(row, type) {
      console.log(row)
      let params = {uid: row.uid, belongPerson: row.belongPerson, country: row.country}
      const that = this
      let alert = '是否修改'
      that.$confirm(alert, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        assignAccount(params).then(response => {
          console.log(params)
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
    queryLogInfo() {
      queryAccountLog(this.logQuery).then(response => {
        this.accountLogList = response.data
      })
    },
    closeVisible(type, row) {

      if (type === 'belongPerson') {
        row.inputUserVisible = false
      }
      if (type === 'status') {
        row.inputStatusVisible = false
      }
      if (type === 'notes') {
        row.inputNotesVisible = false
      }
      if (type === 'category') {
        row.inputCategoryVisible = false
      }
      if (type === 'country') {
        row.inputCountryVisible = false
      }
      if (type === 'account_type') {
        row.inputAccountTypeVisible = false
      }
    },
    handleStatus(status) {
      let str
      switch (status) {
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
      if (column.columnKey === 'status' && this.checkInOperator('handle')) {
        row.inputStatusVisible = true
      }
      if (column.columnKey === 'belongPerson' && this.checkInOperator('handle')) {
        row.inputUserVisible = true
      }
      if (column.columnKey === 'country' && this.checkInOperator('handle')) {
        row.inputCountryVisible = true
      }
      if (column.columnKey === 'category' && this.checkInOperator('category')) {
        row.inputCategoryVisible = true
      }
      if (column.columnKey === 'account_type' && this.checkInOperator('handle')) {
        row.inputAccountTypeVisible = true
      }
      if (column.columnKey === 'notes' && this.checkInOperator('notes')) {
        row.inputNotesVisible = true
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
    queryLog() {
      this.dialogLog = true
    },
    handleToUpdate(row) {
      this.$router.push({path: '/dct/AccountManagement/update/' + row.id})
    },
    handleToDelete(id) {
      const that = this
      that.$confirm('删除该账号', {
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
      exportAccountList(this.listQuery).then(response => {
        let exportAccountList = response.data.list

        // 设置导出列
        const filterVal = ['createTime', 'creator', 'uid', 'belongPerson', 'userGroup', 'country', 'status', 'deliverTime', 'closeTime']
        // 设置对应数据
        const tHeader = ['时间', 'Handle', 'UID', '归属人', '组别', '国家', '状态', '交付日期', '封号日期']
        const filterList = []
        exportAccountList.forEach((item, index) => {
          filterList.push(item)
        })
        const data = this.formatJson(filterVal, filterList)

        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '账号报表'
          })
          this.downloadLoading = false
        })
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        debugger
        if (j === 'createTime' || j === 'deliverTime' || j === 'closeTime') {
          if (v[j] != null) {
            return parseTime(v[j])
          }
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