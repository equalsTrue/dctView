<template>
  <article-detail :type="'0'" :parentId="this.$route.params.id"></article-detail>
</template>

<script>
  import ArticleDetail from './components/PermissionDetail'

  export default {
    name: 'permissionAdd',
    components: { ArticleDetail }
  }
</script>
