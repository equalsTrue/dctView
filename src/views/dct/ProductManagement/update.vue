<template>
  <article-detail :isEdit=true :detailId="this.$route.params.id" :isRestock="this.$route.query.isRestock === 'true' ? true : false"></article-detail>
</template>

<script>
import ArticleDetail from './components/productDetail.vue'

export default {
  name: 'updateproducDetail',
  components: { ArticleDetail }
}
</script>

