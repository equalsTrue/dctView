<template>
  <div class="app-container calendar-list-container">
    <!-- 头部操作区 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleToAdd" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
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

      <el-table-column v-if="false" align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" :label="$t('table.username')">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" :label="'workWeChat'">
        <template slot-scope="scope">
          <span>{{scope.row.workWeChatUserId}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="100px" :label="$t('table.email')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleToUpdateEmail(scope.row)">{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" :label="$t('table.role')">
        <template slot-scope="scope">
          <template v-for="rolename in scope.row.roles" >
            <el-tag>{{rolename}}</el-tag>
          </template>
        </template>
      </el-table-column>


      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary"  @click="handleToResetPassword(scope.row)">{{$t('table.resetPassword')}}</el-button>
          <el-button size="mini" type="primary"  @click="handleToEditRoles(scope.row)">{{$t('table.editRoles')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 阅读量等数据 -->
    <el-dialog title="阅读数据" :visible.sync="dialogPvVisible">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"> </el-table-column>
        <el-table-column prop="pv" label="Pv"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// 数据接口
import { fetchList, deleteUser } from '@/api/user'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'

export default {
  name: 'user',
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
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: 'asc',
        status: undefined
      },
      // 列表头部的筛选条件 - 重要度
      importanceOptions: [1, 2, 3],
      // 列表头部的筛选条件 - 类型
      calendarTypeOptions: [
        { key: 'CN', display_name: 'China' },
        { key: 'US', display_name: 'USA' },
        { key: 'JP', display_name: 'Japan' },
        { key: 'EU', display_name: 'Eurozone' }
      ],
      // 列表头部的筛选条件 - 排序方式
      sortOptions: [
        { label: '按 ID 升序排列', key: 'asc' },
        { label: '按 ID 降序排列', key: 'desc' }
      ],
      // 列表头部的筛选条件 - 数据状态
      statusOptions: [
        { label: '已上线', key: 'published' },
        { label: '草稿', key: 'draft' }
      ],
      // 是否显示阅读数据弹出框
      dialogPvVisible: false,
      // 阅读数据集
      pvData: [],
      // 是否正在导出
      downloadLoading: false
    }
  },
  filters: {
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      if (this.$store.state.tagsView.visitedViews.length > 0) {
        const index = this.$store.state.tagsView.active
        this.$store.state.tagsView.visitedViews[index].query = Object.assign({}, this.listQuery)
      }
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      }).catch(() => {})
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
    // 前往添加页面
    handleToAdd() {
      this.$router.push({ path: '/user/add' })
    },
    // 前往修改密码页面
    handleToResetPassword(row) {
      this.$router.push({ path: '/user/resetPassword/' + row.id })
    },
    // 前往修改Email页面
    handleToUpdateEmail(row) {
      this.$router.push({ path: '/user/updateEmail/' + row.id })
    },
    handleToEditRoles(row) {
      this.$router.push({ path: '/user/editRoles/' + row.id })
    },
    // 删除操作
    handleDelete(row) {
      const that = this
      that.$confirm('是否确认删除?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(response => {
          that.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          const index = that.list.indexOf(row)
          that.list.splice(index, 1)
          row.status = 'deleted'
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

<style>
  .cell .el-tag {
    margin-right: 0.5em;
  }
</style>
