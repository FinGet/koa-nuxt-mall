<template>
  <div>
    <el-header>
      <top-bar/>
    </el-header>
    <el-main>
      <nuxt />
    </el-main>
    <el-footer class="footer">
      <Footer/>
    </el-footer>
  </div>
</template>

<script>
import TopBar from '~/components/topBar'
import Footer from '~/components/footer'
export default {
  components: {
    TopBar,
    Footer
  }
}
</script>

<style lang="less" scoped>
.footer {
  // position: absolute;
  // bottom: 0;
  width: calc(100% - 20px);
}
</style>
