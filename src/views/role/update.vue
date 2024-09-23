<template>
  <article-detail :type="'1'"></article-detail>
</template>

<script>
  import ArticleDetail from './components/RoleDetail'

  export default {
    name: 'roleUpdate',
    components: { ArticleDetail }
  }
</script>

<style>
  .role-permission-tree{
    width: 47%;
    padding: 0 5em;
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
