<template>
  <article-detail :type="'1'" :detailId="this.$route.params.id"></article-detail>
</template>

<script>
import ArticleDetail from './components/UserDetail'

export default {
  name: 'updatePassword',
  components: { ArticleDetail }
}
</script>

