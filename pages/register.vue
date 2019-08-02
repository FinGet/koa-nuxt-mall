<template>
  <div class="register">
    <img :src="banner" alt />
    <div class="form">
      <h1>
        来呀，
        <span>注册一个账号</span>
      </h1>
      <el-form label-width="80px" :model="form" ref="ruleForm" :rules="rules">
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input type="password" v-model="form.userPwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cuserPwd">
          <el-input type="password" v-model="form.cuserPwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="sub-btn" type="primary" @click="onSubmit">快点注册，发车了</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import FormMixins from './form_mixins'
export default {
  mixins: [FormMixins],
  data() {
    return {
      banner: require("../assets/imgs/banner.jpg")
    }
  },
  methods: {
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$axios.post('/users/signup', {
            userName: this.form.userName,
            userPwd : CryptoJS.MD5(this.form.userPwd).toString(),
            email: this.form.email
          }).then(res => {
            if (res.status == 200) {
              this.$message.success('注册成功，去登录吧！')
              this.$router.push({path:'login'})
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.register {
  display: flex;
  width: 80%;
  margin: 0 auto;
  .form {
    .marginL(20px);
    width: 400px;
    h1 {
      margin: 20px 0;
      span {
        color: @redColor;
      }
    }
  }
}
.sub-btn {
  .my-btn;
}
</style>