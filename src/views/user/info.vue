<template>
  <div class="app-container calendar-list-container">
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

      <el-table-column v-if="false" align="center" :label="$t('table.id')" width=65>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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


      <el-table-column align="center" :label="$t('table.actions')" width=230 class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary"  @click="handleToResetPassword(scope.row)">{{$t('table.resetPassword')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// 数据接口
import { fetchCurrentUserInfo } from '@/api/user'
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      fetchCurrentUserInfo(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      }).catch(() => {})
    },
    // 前往修改密码页面
    handleToResetPassword(row) {
      this.$router.push({ path: '/user/resetPassword/' + row.id })
    },
    // 前往修改Email页面
    handleToUpdateEmail(row) {
      this.$router.push({ path: '/user/updateEmail/' + row.id })
    }
  }
}
</script>

<style>
  .cell .el-tag {
    margin-right: 0.5em;
  }
</style>
