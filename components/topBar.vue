<template>
  <div class="top-bar">
    <div class="logo">
      <nuxt-link to="/"><img :src="logo" alt="logo"></nuxt-link>
    </div>
    <div>
      <User/>
    </div>
  </div>
</template>

<script>
import User from '~/components/user'
  export default {
    data() {
      return {
        logo: require('../assets/logo.png')
      }
    },
    components: {
      User
    }
  }
</script>

<style lang="less" scoped>
.top-bar {
  .flex-justify--between-align--center;
  background: @white;
  padding: 5px 30px;
  box-shadow: 0px 0px 2px @redColor;
  .logo {
    img {
      height: 50px;
    }
  }
}
</style>