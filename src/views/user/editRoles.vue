<template>
  <article-detail :type="'3'" :detailId="this.$route.params.id"></article-detail>
</template>

<script>
  import ArticleDetail from './components/UserDetail'

  export default {
    name: 'editRoles',
    components: { ArticleDetail }
  }
</script>

<style>
  .el-select {
    display: inline-block;
    position: relative;
    width: 100%;
  }
</style>
