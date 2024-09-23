<template>
  <div class="app-container calendar-list-container">
    <div style="margin-bottom: 2em;width: 60%;">
      <el-button style="float: right;margin-right: 2em;flex: 1" type="success" @click="addCatalog()">添加目录</el-button>
      <div style="clear: both;"></div>
    </div>
    <div class="permission-tree">
      <!-- 权限树图 -->
      <el-tree :data="treeData" node-key="id" default-expand-all ref="tree" :expand-on-click-node="false" :render-content="renderContent">
      </el-tree>
    </div>

  </div>
</template>

<script>
// 数据接口
import { fetchPermissionList, deletePermission } from '@/api/role_permission'
// 按钮动画特效 - 水波纹指令
import waves from '@/directive/waves'
import { Message } from 'element-ui'
import 'element-ui/lib/tree'

export default {
  name: 'permission',
  directives: {
    waves
  },
  data() {
    return {
      // 数据集
      treeData: [],
      // 加载状态
      listLoading: true
    }
  },
  filters: {
  },
  created() {
    this.getDatas()
  },
  methods: {
    // 获取列表数据
    getDatas() {
      this.listLoading = true
      fetchPermissionList(this.listQuery).then(response => {
        // 处理树状图数据
        this.treeData = response.data
        this.listLoading = false
      }).catch(() => {})
    },
    addCatalog() {
      const newChild = { id: '', label: '新建目录', children: [] }
      this.treeData.push(newChild)
    },
    append(node, data) {
      if (data.id === '' || data.id === null) {
        Message.error('请先修改并保存当前标签！')
        return
      }
      const newChild = { id: '', label: '新建标签', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      const that = this
      if (data.id !== '' && data.id !== null) {
        that.$confirm('是否确认删除权限' + (node.isLeaf ? '？' : '及其子权限？'), '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePermission(data.id).then(response => {
            that.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          }).catch(() => {})
        }).catch(() => {})
      } else {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class = 'custom-tree-node'>
          <span >{node.label}</span>
          <span>
            <span class='icon-btn' on-click={ () => this.handleNodeClick(node, data) }>
              <svg-icon icon-class='edit-square'/>
            </span>
            <span class='icon-btn' on-click={ () => this.append(node, data) }>
              <svg-icon icon-class='plus-circle'/>
            </span>
            <span class='icon-btn' on-click={ () => this.remove(node, data) }>
              <svg-icon icon-class='minus-circle'/>
            </span>
          </span>
        </span>
      )
    },
    handleNodeClick(node, data) {
      // node.store.getCheckedKeys() 获取被可选择的
      if (data.id === '') {
        this.$router.push({ path: '/permission/add/' + node.parent.data.id })
      } else {
        this.$router.push({ path: '/permission/update/' + data.id })
      }
    }
  }
}
</script>

<style>
  .permission-tree{
    width: 60%;
    border: solid #848484;
    padding: 2em;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding-right: 8px;
  }
  .icon-btn{
    font-size: 1.2em;
    margin-left: 1em;
  }
  .el-tree-node__children {
    padding-left: 1.5em;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: #f96c5c;
  }
  .el-tree-node__content:hover {
    background: 	#ffbbb8;
  }
  .el-tree-node__content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 30px;
    cursor: pointer;
  }
  .el-tree-node__expand-icon {
    cursor: pointer;
    color: #65e2dd;
    font-size: 1.5em;
    -webkit-transform: rotate(0);
    transform: rotate(0);
    -webkit-transition: -webkit-transform .3s ease-in-out;
    transition: -webkit-transform .3s ease-in-out;
    transition: transform .3s ease-in-out;
    transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out;
    transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
  }
  .el-tree-node__content {
    border-left: dashed #a5a2a2;
    border-bottom: dotted #26dfe030;
  }
  .el-checkbox__inner{
    border: 2px solid #cabdbd;
  }
</style>
