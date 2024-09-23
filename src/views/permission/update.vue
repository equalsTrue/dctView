<template>
  <article-detail :type="'1'" :detailId="this.$route.params.id"></article-detail>
</template>

<script>
  import ArticleDetail from './components/PermissionDetail'

  export default {
    name: 'permissionUpdate',
    components: { ArticleDetail }
  }
</script>
