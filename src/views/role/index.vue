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
      @cell-dblclick="handleCellDoubleClick"
      style="width: 100%">

      <el-table-column v-if="false" align="center" :label="$t('table.id')" width=65>
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{new Date(scope.row.createTime).getTime()  | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column width="400px" :label="$t('table.role')">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.remark}}</span>
        </template>
      </el-table-column>




      <el-table-column align="center" :label="$t('table.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/role/update/' + scope.row.id">
            <el-button type="primary" size="mini" >{{$t('table.update')}}</el-button>
          </router-link>
          <el-button size="mini" type="danger" style="margin-left: 8px" @click="handleDelete(scope.row)">{{$t('table.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {fetchAppNodeId} from '@/api/dct'
  // 数据接口
  import { fetchRoleList, deleteRole,assignRoleApp } from '@/api/role_permission'
  // 按钮动画特效 - 水波纹指令
  import waves from '@/directive/waves'

  export default {
    name: 'role',
    directives: {
      waves
    },
    data() {
      return {
        tagTypes: [
          '',
          'primary',
          'success',
          'info',
          'warning',
          'danger'
        ],
        allAppIds:[],
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
    filters: {
    },
    created() {
      this.getList()
    },
    methods: {
      // 获取列表数据
      getList() {
        debugger
        this.listLoading = true
        fetchRoleList(this.listQuery).then(response => {
          const tableList = []
          for (const row of response.data) {
            row.inputAppVisible = false
            tableList.push(row)
          }
          this.list = tableList
          this.total = response.data.length
          this.listLoading = false
        }).catch(() => {})
        const queryAppParams = {type: 'assign'}
        fetchAppNodeId(queryAppParams).then(response => {
          this.allAppIds = []
          this.allAppIds = response.data
          const all = {key: '全选', value: 'all'}
          this.allAppIds.unshift(all)
        }).catch(err => {
          console.log(err)
        })
      },
      handleCellDoubleClick(row, column, cell, event) {
        debugger
        if (column.columnKey === 'appIds') {
          row.inputAppVisible = true
        }

      },
      cancelAssignApp(row){
        row.inputAppVisible = false
      },
      handleSelectConfirm(row,type){
        let params
        const that = this
        let alert
        let updateType
        switch (type){
          case 'appIds':
            alert = '是否重新分配APP'
            updateType = 5
            params = {roleId: row.id, appId:row.appIds }
            break;
          default:
        }
        that.$confirm(alert, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          assignRoleApp(params).then(response => {
            debugger
            if (response.code === 200) {
              that.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.closeVisible(type,row)
              that.fetchList()
            }
          }).catch(err => {
            console.log(err)
          })
        })
        row.inputVisible = false
      },
      handleAppNodeId(appName) {
        let nodeId
        if(appName == 'all'){
          nodeId = '全选'
        }else {
          this.allAppIds.forEach((item, index) => {
            if (item.value == appName) {
              nodeId = item.key
              return nodeId
            }
          })
        }

        return nodeId
      },
      closeVisible(type,row){
        if (type === 'appIds') {
          row.inputAppVisible = false
        }
      },



      // 前往添加页面
      handleToAdd() {
        this.$router.push({ path: '/role/add' })
      },
      // 前往修改页面
      handleToUpdate(row) {
        this.$router.push({ path: '/role/update/' + row.id })
      },
      // 删除操作
      handleDelete(row) {
        const that = this
        that.$confirm('是否确认删除?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row.id).then(response => {
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
