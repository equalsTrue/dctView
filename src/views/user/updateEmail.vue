<template>
  <article-detail :type="'2'" :detailId="this.$route.params.id"></article-detail>
</template>

<script>
import ArticleDetail from './components/UserDetail'

export default {
  name: 'updateEmail',
  components: { ArticleDetail }
}
</script>

