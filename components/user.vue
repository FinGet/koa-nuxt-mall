<template>
  <div class="user">
    <div v-if="user.name">
      <p>欢迎您：<span class="user-name">{{user.name}}</span>
      <el-tooltip class="item" effect="light" content="退出登录" placement="bottom-start">
        <i class="el-icon-circle-close"></i>
      </el-tooltip>
    </p>
    </div>
    <div v-else class="login">
      <span>
        <nuxt-link to="/register">注册</nuxt-link>
        </span>
      <span>
        <nuxt-link to="/register">登录</nuxt-link></span>
    </div>
    <div class="cart">
      <el-tooltip class="item" effect="light" content="购物车" placement="bottom-start">
        <i class="el-icon-shopping-cart-full"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: {name: 'admin'}
      }
    },
  }
</script>

<style lang="less" scoped>
.user {
  .flex-align--center;
  &>div p {
    .flex-align--center;
  }
  i {
    .marginL;
    color: @redColor;
    font-size: 20px;
    cursor: pointer;
  }
  color: @blackColor;
  .user-name {
    color: @redColor;
  }
  .login {
    font-size: 15px;
    a {
      &:hover {
        color: @redColor;
      }
    }
  }
  .cart {
    .marginL(15px);
    .marginR(30px);
    font-size: 20px;
    color: @redColor;
    border-left: 1px solid @redColor;
  }
}
</style>