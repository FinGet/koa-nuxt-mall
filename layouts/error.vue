<template>
  <div class="container">
    <h1>404页面不存在</h1>
    <nuxt-link to="/">回 首 页</nuxt-link>
  </div>
</template>

<script>
export default {
  layout: 'blank' // 你可以为错误页面指定自定义的布局
}
</script>
<style lang="less" scoped>
.container{
 .flex-direction--column;
 height: 500px;
 align-items: center;
 h1{
   color: @redColor;
   font-size: 30px;
 }
 a{
   text-decoration: underline;
 }
}
</style>
