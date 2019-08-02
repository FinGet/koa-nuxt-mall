<template>
  <div class="footer">
    <el-divider></el-divider>
    <div class="copy-right">
      <span>Copyright © 2019 FinGet All Rights Reserved.</span>
      <a href="https://finget.github.io" target="_blank">About Us</a>
      <a href="https://finget.github.io" target="_blank">Terms &amp; Conditions</a>
      <a href="https://finget.github.io" target="_blank">Privacy Policy</a>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.footer {
  height: 88px;
}
.copy-right {
  .flex-justify-align--center;
  color: @blackColor;
  a {
    .marginL(20px);
    color: @redColor;
  }
}
</style>